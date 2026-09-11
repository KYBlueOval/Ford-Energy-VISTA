package com.fordenergy.vista;

import android.Manifest;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.Uri;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import java.io.File;
import java.io.IOException;
import java.util.Locale;

public class MainActivity extends ComponentActivity {
    private static final String BASE_URL = "https://kyblueoval.github.io/Ford-Energy-VISTA/";
    private static final String APP_VERSION = "2.7.0";
    private static final int FILE_CHOOSER_REQUEST = 702;
    private static final int CAMERA_PERMISSION_REQUEST = 703;

    private View dashboard;
    private View webContainer;
    private View offlinePanel;
    private WebView webView;
    private ProgressBar pageProgress;
    private TextView networkStatus;
    private TextView dashboardNfcStatus;
    private TextView nfcStatus;
    private TextView moduleTitle;
    private TextView moduleSubtitle;
    private NfcAdapter nfcAdapter;
    private PendingIntent nfcIntent;
    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;
    private PermissionRequest pendingWebPermission;
    private boolean waitingForCameraChooser;
    private boolean webWorkspaceVisible;
    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;
    private String lastRequestedUrl = BASE_URL;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        getWindow().setStatusBarColor(getColor(R.color.vista_navy));
        getWindow().setNavigationBarColor(getColor(R.color.vista_blue));
        WindowInsetsControllerCompat bars = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        bars.setAppearanceLightStatusBars(false);
        bars.setAppearanceLightNavigationBars(false);
        setContentView(R.layout.activity_main);
        bindViews();
        configureDashboard();
        configureBackNavigation();
        configureWebView();
        configureNfc();
        configureConnectivity();

        if (state != null) {
            webWorkspaceVisible = state.getBoolean("webWorkspaceVisible", false);
            lastRequestedUrl = state.getString("lastRequestedUrl", BASE_URL);
            webView.restoreState(state);
            setWorkspaceVisible(webWorkspaceVisible);
        } else {
            Uri deepLink = getIntent() == null ? null : getIntent().getData();
            if (isVistaUri(deepLink)) openWorkspace(deepLink.toString(), titleForUrl(deepLink.toString()));
            else showDashboard();
        }
        handleNfcIntent(getIntent());
    }

    private void bindViews() {
        dashboard = findViewById(R.id.dashboard);
        webContainer = findViewById(R.id.webContainer);
        offlinePanel = findViewById(R.id.offlinePanel);
        webView = findViewById(R.id.webView);
        pageProgress = findViewById(R.id.pageProgress);
        networkStatus = findViewById(R.id.networkStatus);
        dashboardNfcStatus = findViewById(R.id.dashboardNfcStatus);
        nfcStatus = findViewById(R.id.nfcStatus);
        moduleTitle = findViewById(R.id.moduleTitle);
        moduleSubtitle = findViewById(R.id.moduleSubtitle);
    }

    private void configureDashboard() {
        findViewById(R.id.openSecurity).setOnClickListener(v -> openWorkspace(BASE_URL + "security-console/", "Security Operations"));
        findViewById(R.id.openSponsor).setOnClickListener(v -> openWorkspace(BASE_URL + "sponsor-portal/", "Sponsor & Approver"));
        findViewById(R.id.openAdmin).setOnClickListener(v -> openWorkspace(BASE_URL + "admin-console/", "System Administration"));
        findViewById(R.id.openRegistration).setOnClickListener(v -> openWorkspace(BASE_URL + "public-registration/", "Visitor Registration"));
        findViewById(R.id.openEv).setOnClickListener(v -> openWorkspace(BASE_URL + "ev-charging-request/", "EV Charging Access"));
        findViewById(R.id.navBack).setOnClickListener(v -> navigateBack());
        findViewById(R.id.navHome).setOnClickListener(v -> showDashboard());
        findViewById(R.id.navRefresh).setOnClickListener(v -> reloadWorkspace());
        findViewById(R.id.offlineRetry).setOnClickListener(v -> reloadWorkspace());
    }

    private void configureBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                if (webWorkspaceVisible) navigateBack();
                else finish();
            }
        });
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " FordEnergyVISTA-Android/" + APP_VERSION);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        WebView.setWebContentsDebuggingEnabled(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                lastRequestedUrl = url;
                offlinePanel.setVisibility(View.GONE);
                pageProgress.setVisibility(View.VISIBLE);
                updateModuleTitle(url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageProgress.setVisibility(View.GONE);
                updateModuleTitle(url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) showOfflinePanel();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isVistaUri(uri)) return false;
                openExternal(uri);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int progress) {
                pageProgress.setProgress(progress);
                pageProgress.setVisibility(progress >= 100 ? View.GONE : View.VISIBLE);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> handleWebPermission(request));
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                launchImageChooser();
                return true;
            }
        });
    }

    private void handleWebPermission(PermissionRequest request) {
        if (!isVistaUri(request.getOrigin())) {
            request.deny();
            return;
        }
        boolean cameraRequested = false;
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) cameraRequested = true;
        }
        if (!cameraRequested) {
            request.deny();
        } else if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
        } else {
            pendingWebPermission = request;
            requestPermissions(new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
        }
    }

    private boolean isVistaUri(Uri uri) {
        if (uri == null || !"https".equalsIgnoreCase(uri.getScheme())) return false;
        String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(Locale.US);
        String path = uri.getPath() == null ? "" : uri.getPath();
        return ("kyblueoval.github.io".equals(host) && path.startsWith("/Ford-Energy-VISTA/"))
            || "script.google.com".equals(host)
            || host.endsWith(".googleusercontent.com");
    }

    private void openExternal(Uri uri) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
        catch (ActivityNotFoundException ignored) { Toast.makeText(this, "No application can open this link.", Toast.LENGTH_SHORT).show(); }
    }

    private void openWorkspace(String url, String title) {
        if (!hasInternet()) {
            lastRequestedUrl = url;
            setWorkspaceVisible(true);
            moduleTitle.setText(title);
            showOfflinePanel();
            return;
        }
        setWorkspaceVisible(true);
        moduleTitle.setText(title);
        moduleSubtitle.setText("FORD ENERGY · SECURE MOBILE WORKSPACE");
        offlinePanel.setVisibility(View.GONE);
        if (!url.equals(webView.getUrl())) webView.loadUrl(url);
    }

    private void showDashboard() {
        setWorkspaceVisible(false);
        offlinePanel.setVisibility(View.GONE);
    }

    private void setWorkspaceVisible(boolean visible) {
        webWorkspaceVisible = visible;
        dashboard.setVisibility(visible ? View.GONE : View.VISIBLE);
        webContainer.setVisibility(visible ? View.VISIBLE : View.GONE);
    }

    private void navigateBack() {
        if (webView.canGoBack()) webView.goBack();
        else showDashboard();
    }

    private void reloadWorkspace() {
        if (!hasInternet()) {
            showOfflinePanel();
            return;
        }
        offlinePanel.setVisibility(View.GONE);
        if (webView.getUrl() == null) webView.loadUrl(lastRequestedUrl);
        else webView.reload();
    }

    private void showOfflinePanel() {
        pageProgress.setVisibility(View.GONE);
        offlinePanel.setVisibility(View.VISIBLE);
    }

    private String titleForUrl(String url) {
        if (url.contains("security-console")) return "Security Operations";
        if (url.contains("sponsor-portal")) return "Sponsor & Approver";
        if (url.contains("admin-console")) return "System Administration";
        if (url.contains("public-registration")) return "Visitor Registration";
        if (url.contains("ev-charging-request")) return "EV Charging Access";
        return "VISTA Home";
    }

    private void updateModuleTitle(String url) {
        moduleTitle.setText(titleForUrl(url == null ? "" : url));
    }

    private void configureConnectivity() {
        connectivityManager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override public void onAvailable(Network network) { runOnUiThread(() -> updateNetworkStatus(true)); }
            @Override public void onLost(Network network) { runOnUiThread(() -> updateNetworkStatus(hasInternet())); }
            @Override public void onCapabilitiesChanged(Network network, NetworkCapabilities capabilities) { runOnUiThread(() -> updateNetworkStatus(capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED))); }
        };
        connectivityManager.registerNetworkCallback(new NetworkRequest.Builder().addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET).build(), networkCallback);
        updateNetworkStatus(hasInternet());
    }

    private boolean hasInternet() {
        if (connectivityManager == null) return false;
        Network network = connectivityManager.getActiveNetwork();
        NetworkCapabilities capabilities = network == null ? null : connectivityManager.getNetworkCapabilities(network);
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void updateNetworkStatus(boolean connected) {
        networkStatus.setText(connected ? "● Connected" : "● Offline");
        networkStatus.setTextColor(getColor(connected ? R.color.vista_green : R.color.vista_orange));
        if (connected && webWorkspaceVisible && offlinePanel.getVisibility() == View.VISIBLE) offlinePanel.setVisibility(View.GONE);
    }

    private void configureNfc() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        nfcIntent = PendingIntent.getActivity(this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        updateNfcStatus();
    }

    private void updateNfcStatus() {
        String label;
        if (nfcAdapter == null) label = "NFC unavailable";
        else if (!nfcAdapter.isEnabled()) label = "Enable NFC";
        else label = "NFC ready";
        dashboardNfcStatus.setText(label);
        nfcStatus.setText(label);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (nfcAdapter != null) nfcAdapter.enableForegroundDispatch(this, nfcIntent, null, null);
        updateNfcStatus();
    }

    @Override
    protected void onPause() {
        if (nfcAdapter != null) nfcAdapter.disableForegroundDispatch(this);
        super.onPause();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (isVistaUri(intent.getData())) openWorkspace(intent.getDataString(), titleForUrl(intent.getDataString()));
        handleNfcIntent(intent);
    }

    private void handleNfcIntent(Intent intent) {
        if (intent == null || !NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction())) return;
        @SuppressWarnings("deprecation") Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        if (tag == null || tag.getId() == null) return;
        StringBuilder uid = new StringBuilder();
        for (byte value : tag.getId()) uid.append(String.format(Locale.US, "%02X", value));
        deliverNfcUid(uid.toString());
    }

    private void deliverNfcUid(String uid) {
        dashboardNfcStatus.setText("NFC read · " + uid);
        nfcStatus.setText("NFC · " + uid);
        if (!webWorkspaceVisible) {
            Toast.makeText(this, "Open Security, Sponsor, or Administration to use this badge.", Toast.LENGTH_LONG).show();
            return;
        }
        String safeUid = uid.replace("\\", "\\\\").replace("'", "\\'");
        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('vista:nfc-scan',{detail:{uid:'" + safeUid + "',source:'android-nfc'}}));", null);
        Toast.makeText(this, "VISTA badge read", Toast.LENGTH_SHORT).show();
    }

    private void launchImageChooser() {
        Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
        pick.addCategory(Intent.CATEGORY_OPENABLE);
        pick.setType("image/*");
        Intent camera = buildCameraIntent();
        if (camera == null && getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY) && checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            waitingForCameraChooser = true;
            requestPermissions(new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
            return;
        }
        Intent chooser = Intent.createChooser(pick, "VISTA photo source");
        if (camera != null) chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
        startActivityForResult(chooser, FILE_CHOOSER_REQUEST);
    }

    private Intent buildCameraIntent() {
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY) || checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) return null;
        try {
            File directory = new File(getCacheDir(), "camera");
            if (!directory.exists() && !directory.mkdirs()) return null;
            File photo = File.createTempFile("VISTA-", ".jpg", directory);
            cameraUri = FileProvider.getUriForFile(this, getPackageName() + ".files", photo);
            Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            camera.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
            camera.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            return camera;
        } catch (IOException ignored) { return null; }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK) {
            Uri selected = data == null ? cameraUri : data.getData();
            if (selected != null) result = new Uri[]{selected};
        }
        fileCallback.onReceiveValue(result);
        fileCallback = null;
        cameraUri = null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode != CAMERA_PERMISSION_REQUEST) return;
        boolean granted = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
        if (pendingWebPermission != null) {
            if (granted) pendingWebPermission.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
            else pendingWebPermission.deny();
            pendingWebPermission = null;
        }
        if (waitingForCameraChooser) {
            waitingForCameraChooser = false;
            if (granted) launchImageChooser();
            else if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putBoolean("webWorkspaceVisible", webWorkspaceVisible);
        outState.putString("lastRequestedUrl", lastRequestedUrl);
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (connectivityManager != null && networkCallback != null) {
            try { connectivityManager.unregisterNetworkCallback(networkCallback); } catch (IllegalArgumentException ignored) { }
        }
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        if (webView != null) { webView.stopLoading(); webView.destroy(); }
        super.onDestroy();
    }
}
