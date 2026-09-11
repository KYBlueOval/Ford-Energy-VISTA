package com.fordenergy.vista;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.provider.MediaStore;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {
    private static final String BASE_URL = "https://kyblueoval.github.io/Ford-Energy-VISTA/";
    private static final String API_URL = "https://script.google.com/macros/s/AKfycbxJhQ9P6V8Un4oyZEy5JNp4ravCRbfKm1Dvbay87t_pydQmwNhOMJfxIBmAlBMNoMLQ/exec";
    private static final Workspace SECURITY = new Workspace("Security Operations", BASE_URL + "security-console/", "viewVisits");
    private static final Workspace SPONSOR = new Workspace("Sponsor & Approver", BASE_URL + "sponsor-portal/", "sponsorPortal");
    private static final Workspace ADMIN = new Workspace("Administration", BASE_URL + "admin-console/", "manageUsers");
    private static final Workspace REGISTRATION = new Workspace("Visitor Registration", BASE_URL + "public-registration/", "");
    private static final Workspace EV = new Workspace("EV Charging Access", BASE_URL + "ev-charging-request/", "");
    private static final long NFC_DUPLICATE_WINDOW_MS = 900L;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final ExecutorService networkExecutor = Executors.newSingleThreadExecutor();

    private ScrollView dashboard;
    private LinearLayout authContainer;
    private LinearLayout authBadgePanel;
    private LinearLayout authPinPanel;
    private LinearLayout webContainer;
    private LinearLayout offlinePanel;
    private TextView networkStatus;
    private TextView dashboardNfcStatus;
    private TextView authModuleTitle;
    private TextView authStatus;
    private TextView authPinStatus;
    private TextView authUid;
    private TextView moduleTitle;
    private TextView nfcStatus;
    private EditText authUsername;
    private EditText authPin;
    private ProgressBar authProgress;
    private ProgressBar authPinProgress;
    private ProgressBar pageProgress;
    private WebView webView;

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;
    private NfcAdapter nfcAdapter;
    private PendingIntent nfcIntent;
    private IntentFilter[] nfcIntentFilters;
    private String[][] nfcTechLists;
    private boolean readerModeEnabled;
    private String lastNfcUid = "";
    private long lastNfcReadAtMs;

    private Workspace pendingWorkspace;
    private boolean authenticating;
    private boolean webWorkspaceVisible;
    private String lastRequestedUrl = BASE_URL;
    private String sessionToken = "";
    private JSONObject sessionUser;
    private JSONObject sessionPermissions;
    private boolean sessionInjectionPending;
    private String queuedNfcUid = "";

    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;
    private PermissionRequest pendingWebPermission;
    private boolean waitingForCameraChooser;
    private ActivityResultLauncher<Intent> photoChooserLauncher;
    private ActivityResultLauncher<String> cameraPermissionLauncher;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        getWindow().setStatusBarColor(getColor(R.color.vista_navy));
        getWindow().setNavigationBarColor(getColor(R.color.vista_blue));
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        WindowInsetsControllerCompat bars = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        bars.setAppearanceLightStatusBars(false);
        bars.setAppearanceLightNavigationBars(false);
        setContentView(R.layout.activity_main);

        bindViews();
        configureActivityResults();
        configureDashboard();
        configureAuthentication();
        configureBackNavigation();
        configureWebView();
        configureNfc();
        configureConnectivity();

        Uri deepLink = getIntent() == null ? null : getIntent().getData();
        if (isVistaUri(deepLink)) routeDeepLink(deepLink.toString());
        else showDashboard();
        handleNfcIntent(getIntent());
    }

    private void bindViews() {
        dashboard = findViewById(R.id.dashboard);
        authContainer = findViewById(R.id.authContainer);
        authBadgePanel = findViewById(R.id.authBadgePanel);
        authPinPanel = findViewById(R.id.authPinPanel);
        webContainer = findViewById(R.id.webContainer);
        offlinePanel = findViewById(R.id.offlinePanel);
        networkStatus = findViewById(R.id.networkStatus);
        dashboardNfcStatus = findViewById(R.id.dashboardNfcStatus);
        authModuleTitle = findViewById(R.id.authModuleTitle);
        authStatus = findViewById(R.id.authStatus);
        authPinStatus = findViewById(R.id.authPinStatus);
        authUid = findViewById(R.id.authUid);
        authUsername = findViewById(R.id.authUsername);
        authPin = findViewById(R.id.authPin);
        authProgress = findViewById(R.id.authProgress);
        authPinProgress = findViewById(R.id.authPinProgress);
        moduleTitle = findViewById(R.id.moduleTitle);
        nfcStatus = findViewById(R.id.nfcStatus);
        pageProgress = findViewById(R.id.pageProgress);
        webView = findViewById(R.id.webView);
    }

    private void configureActivityResults() {
        photoChooserLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            if (fileCallback == null) return;
            Uri[] selected = null;
            if (result.getResultCode() == RESULT_OK) {
                Intent data = result.getData();
                Uri uri = data == null ? cameraUri : data.getData();
                if (uri != null) selected = new Uri[]{uri};
            }
            fileCallback.onReceiveValue(selected);
            fileCallback = null;
            cameraUri = null;
        });
        cameraPermissionLauncher = registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
            if (pendingWebPermission != null) {
                if (granted) pendingWebPermission.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                else pendingWebPermission.deny();
                pendingWebPermission = null;
            }
            if (waitingForCameraChooser) {
                waitingForCameraChooser = false;
                if (granted) launchImageChooser();
                else cancelFileChooser();
            }
        });
    }

    private void configureDashboard() {
        findViewById(R.id.openSecurity).setOnClickListener(v -> requestSecureWorkspace(SECURITY));
        findViewById(R.id.openSponsor).setOnClickListener(v -> requestSecureWorkspace(SPONSOR));
        findViewById(R.id.openAdmin).setOnClickListener(v -> requestSecureWorkspace(ADMIN));
        findViewById(R.id.openRegistration).setOnClickListener(v -> openWorkspace(REGISTRATION));
        findViewById(R.id.openEv).setOnClickListener(v -> openWorkspace(EV));
        findViewById(R.id.navBack).setOnClickListener(v -> handleBack());
        findViewById(R.id.navHome).setOnClickListener(v -> showDashboard());
        findViewById(R.id.navRefresh).setOnClickListener(v -> webView.reload());
        findViewById(R.id.offlineRetry).setOnClickListener(v -> {
            if (isConnected()) {
                offlinePanel.setVisibility(View.GONE);
                webView.loadUrl(lastRequestedUrl);
            } else Toast.makeText(this, "Mobile data or Wi-Fi is still unavailable.", Toast.LENGTH_SHORT).show();
        });
    }

    private void configureAuthentication() {
        findViewById(R.id.authBack).setOnClickListener(v -> showDashboard());
        findViewById(R.id.showPinLogin).setOnClickListener(v -> showPinMode());
        findViewById(R.id.showBadgeLogin).setOnClickListener(v -> showBadgeMode());
        findViewById(R.id.authPinSubmit).setOnClickListener(v -> authenticateWithPin());
        authPin.setOnEditorActionListener((v, actionId, event) -> {
            authenticateWithPin();
            return true;
        });
    }

    private void configureBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() { handleBack(); }
        });
    }

    private void handleBack() {
        if (webContainer.getVisibility() == View.VISIBLE && webView.canGoBack()) webView.goBack();
        else showDashboard();
    }

    private void requestSecureWorkspace(Workspace workspace) {
        if (!isConnected()) {
            Toast.makeText(this, "A secure internet connection is required.", Toast.LENGTH_LONG).show();
            return;
        }
        pendingWorkspace = workspace;
        if (sessionToken.length() > 0 && hasPermission(workspace.permission)) {
            openAuthenticatedWorkspace(workspace);
            return;
        }
        dashboard.setVisibility(View.GONE);
        webContainer.setVisibility(View.GONE);
        authContainer.setVisibility(View.VISIBLE);
        authModuleTitle.setText(workspace.title.toUpperCase(Locale.US));
        resetAuthStatus();
        showBadgeMode();
    }

    private void showBadgeMode() {
        authBadgePanel.setVisibility(View.VISIBLE);
        authPinPanel.setVisibility(View.GONE);
        authStatus.setText(nfcAdapter == null ? "This device does not include an NFC reader. Use username and PIN." :
                nfcAdapter.isEnabled() ? "Hold the badge near the NFC area on your device." : "Enable NFC in Android settings or use username and PIN.");
    }

    private void showPinMode() {
        authBadgePanel.setVisibility(View.GONE);
        authPinPanel.setVisibility(View.VISIBLE);
        authUsername.requestFocus();
    }

    private void resetAuthStatus() {
        authenticating = false;
        authProgress.setVisibility(View.GONE);
        authPinProgress.setVisibility(View.GONE);
        authPinStatus.setVisibility(View.GONE);
        authUid.setVisibility(View.GONE);
        authUid.setText("");
        authStatus.setTextColor(getColor(R.color.vista_muted));
    }

    private void authenticateWithPin() {
        String username = String.valueOf(authUsername.getText()).trim();
        String pin = String.valueOf(authPin.getText()).trim();
        if (username.isEmpty() || pin.isEmpty()) {
            Toast.makeText(this, "Enter your VISTA username and PIN.", Toast.LENGTH_SHORT).show();
            return;
        }
        JSONObject payload = new JSONObject();
        try { payload.put("username", username); payload.put("pin", pin); }
        catch (Exception ignored) { }
        authenticate("pinLogin", payload, "Signing in securely…");
    }

    private void authenticateWithBadge(String uid) {
        JSONObject payload = new JSONObject();
        try { payload.put("badgeUid", uid); }
        catch (Exception ignored) { }
        authUid.setText("BADGE UID  " + uid);
        authUid.setVisibility(View.VISIBLE);
        authenticate("badgeLogin", payload, "Badge read · verifying VISTA access…");
    }

    private void authenticate(String action, JSONObject payload, String message) {
        if (authenticating || pendingWorkspace == null) return;
        authenticating = true;
        setAuthenticationMessage(message, R.color.vista_blue, true);
        try { payload.put("userAgent", "Ford Energy VISTA Android 2.7.1"); }
        catch (Exception ignored) { }
        Workspace target = pendingWorkspace;
        networkExecutor.execute(() -> {
            try {
                JSONObject request = new JSONObject();
                request.put("action", action);
                request.put("payload", payload);
                JSONObject response = postJson(request);
                if (!response.optBoolean("ok")) throw new IOException(response.optString("error", "VISTA sign-in failed."));
                JSONObject permissions = response.optJSONObject("permissions");
                if (permissions == null || !permissions.optBoolean(target.permission)) {
                    throw new IOException("This account is not authorized for " + target.title + ".");
                }
                sessionToken = response.optString("token", "");
                sessionUser = response.optJSONObject("user");
                sessionPermissions = permissions;
                if (sessionToken.isEmpty() || sessionUser == null) throw new IOException("VISTA returned an incomplete secure session.");
                mainHandler.post(() -> {
                    authenticating = false;
                    setAuthenticationMessage("Identity confirmed · opening " + target.title, R.color.vista_green, false);
                    openAuthenticatedWorkspace(target);
                });
            } catch (Exception error) {
                mainHandler.post(() -> {
                    authenticating = false;
                    setAuthenticationMessage(safeError(error), R.color.vista_red, false);
                    authPin.setText("");
                });
            }
        });
    }

    private void setAuthenticationMessage(String message, int colorResource, boolean busy) {
        int color = getColor(colorResource);
        authStatus.setText(message);
        authStatus.setTextColor(color);
        authPinStatus.setText(message);
        authPinStatus.setTextColor(color);
        authPinStatus.setVisibility(View.VISIBLE);
        authProgress.setVisibility(busy ? View.VISIBLE : View.GONE);
        authPinProgress.setVisibility(busy ? View.VISIBLE : View.GONE);
    }

    private JSONObject postJson(JSONObject request) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(API_URL).openConnection();
        connection.setConnectTimeout(30000);
        connection.setReadTimeout(90000);
        connection.setInstanceFollowRedirects(true);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "text/plain;charset=utf-8");
        connection.setRequestProperty("Accept", "application/json");
        connection.setDoOutput(true);
        byte[] bytes = request.toString().getBytes(StandardCharsets.UTF_8);
        connection.setFixedLengthStreamingMode(bytes.length);
        try (OutputStream stream = connection.getOutputStream()) { stream.write(bytes); }
        int status = connection.getResponseCode();
        InputStream body = status >= 200 && status < 400 ? connection.getInputStream() : connection.getErrorStream();
        StringBuilder text = new StringBuilder();
        if (body != null) try (BufferedReader reader = new BufferedReader(new InputStreamReader(body, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) text.append(line);
        }
        connection.disconnect();
        String responseText = text.toString().trim();
        if (responseText.startsWith("<!DOCTYPE") || responseText.startsWith("<html")) throw new IOException("VISTA received a Google service page. Verify the active Apps Script deployment.");
        return new JSONObject(responseText);
    }

    private boolean hasPermission(String key) {
        return sessionPermissions != null && sessionPermissions.optBoolean(key);
    }

    private void openAuthenticatedWorkspace(Workspace workspace) {
        sessionInjectionPending = true;
        openWorkspace(workspace);
    }

    private void openWorkspace(Workspace workspace) {
        lastRequestedUrl = workspace.url;
        moduleTitle.setText(workspace.title);
        dashboard.setVisibility(View.GONE);
        authContainer.setVisibility(View.GONE);
        webContainer.setVisibility(View.VISIBLE);
        webWorkspaceVisible = true;
        if (!isConnected()) offlinePanel.setVisibility(View.VISIBLE);
        else {
            offlinePanel.setVisibility(View.GONE);
            webView.loadUrl(workspace.url);
        }
    }

    private void showDashboard() {
        pendingWorkspace = null;
        authenticating = false;
        webWorkspaceVisible = false;
        authContainer.setVisibility(View.GONE);
        webContainer.setVisibility(View.GONE);
        dashboard.setVisibility(View.VISIBLE);
        updateNfcStatus();
    }

    private void routeDeepLink(String url) {
        Workspace target = workspaceForUrl(url);
        if (target.permission.isEmpty()) openWorkspace(new Workspace(target.title, url, ""));
        else requestSecureWorkspace(new Workspace(target.title, url, target.permission));
    }

    private Workspace workspaceForUrl(String url) {
        if (url.contains("security-console")) return SECURITY;
        if (url.contains("sponsor-portal")) return SPONSOR;
        if (url.contains("admin-console")) return ADMIN;
        if (url.contains("ev-charging-request")) return EV;
        return REGISTRATION;
    }

    private void configureWebView() {
        WebView.setWebContentsDebuggingEnabled(false);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " FordEnergyVISTA-Android/2.7.1");
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);

        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isAllowedInApp(uri)) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                lastRequestedUrl = url;
                offlinePanel.setVisibility(View.GONE);
                if (sessionInjectionPending && sessionToken.length() > 0 && isVistaUri(Uri.parse(url))) {
                    sessionInjectionPending = false;
                    String script = "sessionStorage.setItem('feVistaToken'," + JSONObject.quote(sessionToken) + ");" +
                            "sessionStorage.setItem('feVistaUser'," + JSONObject.quote(sessionUser.toString()) + ");" +
                            "sessionStorage.setItem('feVistaPermissions'," + JSONObject.quote(sessionPermissions.toString()) + ");" +
                            "sessionStorage.setItem('feVistaNativeClient','2.7.1');location.reload();";
                    view.evaluateJavascript(script, null);
                    return;
                }
                if (!queuedNfcUid.isEmpty()) {
                    String queued = queuedNfcUid;
                    queuedNfcUid = "";
                    dispatchNfcToWeb(queued);
                }
            }

        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view, int progress) {
                pageProgress.setProgress(progress);
                pageProgress.setVisibility(progress < 100 ? View.VISIBLE : View.GONE);
            }

            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                cancelFileChooser();
                fileCallback = callback;
                launchImageChooser();
                return true;
            }

            @Override public void onPermissionRequest(PermissionRequest request) {
                Uri origin = request.getOrigin();
                if (!isVistaUri(origin) || !contains(request.getResources(), PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                    request.deny();
                    return;
                }
                if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                else {
                    pendingWebPermission = request;
                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA);
                }
            }
        });
    }

    private void launchImageChooser() {
        Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
        pick.addCategory(Intent.CATEGORY_OPENABLE);
        pick.setType("image/*");
        Intent camera = buildCameraIntent();
        if (camera == null && getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY) && checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            waitingForCameraChooser = true;
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA);
            return;
        }
        Intent chooser = Intent.createChooser(pick, "VISTA photo source");
        if (camera != null) chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
        photoChooserLauncher.launch(chooser);
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
            return camera.resolveActivity(getPackageManager()) == null ? null : camera;
        } catch (IOException ignored) { return null; }
    }

    private void cancelFileChooser() {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        fileCallback = null;
        cameraUri = null;
    }

    private void configureNfc() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        Intent intent = new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        nfcIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        nfcIntentFilters = new IntentFilter[]{new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED), new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED), new IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED)};
        nfcTechLists = new String[][]{new String[]{}};
        updateNfcStatus();
    }

    private void enableNfcAcquisition() {
        if (nfcAdapter == null || !nfcAdapter.isEnabled()) return;
        try {
            int flags = NfcAdapter.FLAG_READER_NFC_A | NfcAdapter.FLAG_READER_NFC_B | NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK;
            nfcAdapter.enableReaderMode(this, tag -> handleNfcTag(tag, "reader_mode"), flags, null);
            readerModeEnabled = true;
        } catch (Exception readerError) {
            readerModeEnabled = false;
            try { nfcAdapter.enableForegroundDispatch(this, nfcIntent, nfcIntentFilters, nfcTechLists); }
            catch (Exception ignored) { }
        }
    }

    private void disableNfcAcquisition() {
        if (nfcAdapter == null) return;
        if (readerModeEnabled) {
            try { nfcAdapter.disableReaderMode(this); }
            catch (Exception ignored) { }
            readerModeEnabled = false;
        }
        try { nfcAdapter.disableForegroundDispatch(this); }
        catch (Exception ignored) { }
    }

    @Override protected void onResume() {
        super.onResume();
        enableNfcAcquisition();
        updateNfcStatus();
    }

    @Override protected void onPause() {
        disableNfcAcquisition();
        super.onPause();
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (isVistaUri(intent.getData())) routeDeepLink(intent.getDataString());
        handleNfcIntent(intent);
    }

    private void handleNfcIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (!NfcAdapter.ACTION_TAG_DISCOVERED.equals(action) && !NfcAdapter.ACTION_TECH_DISCOVERED.equals(action) && !NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) return;
        Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        if (tag != null) handleNfcTag(tag, "intent");
    }

    private void handleNfcTag(Tag tag, String source) {
        byte[] id = tag.getId();
        if (id == null || id.length == 0) return;
        StringBuilder raw = new StringBuilder();
        for (byte value : id) raw.append(String.format(Locale.US, "%02X", value));
        String uid = raw.toString();
        mainHandler.post(() -> {
            if (isDuplicateNfcRead(uid)) return;
            dashboardNfcStatus.setText("Badge read · " + uid);
            nfcStatus.setText("NFC · " + uid);
            if (authContainer.getVisibility() == View.VISIBLE && pendingWorkspace != null) authenticateWithBadge(uid);
            else if (webContainer.getVisibility() == View.VISIBLE) dispatchNfcToWeb(uid);
            else Toast.makeText(this, "Badge read. Choose Security, Sponsor, or Administration to sign in.", Toast.LENGTH_LONG).show();
        });
    }

    private boolean isDuplicateNfcRead(String uid) {
        long now = SystemClock.elapsedRealtime();
        boolean duplicate = uid.equals(lastNfcUid) && now - lastNfcReadAtMs < NFC_DUPLICATE_WINDOW_MS;
        if (!duplicate) {
            lastNfcUid = uid;
            lastNfcReadAtMs = now;
        }
        return duplicate;
    }

    private void dispatchNfcToWeb(String uid) {
        if (pageProgress.getVisibility() == View.VISIBLE) {
            queuedNfcUid = uid;
            return;
        }
        String script = "window.dispatchEvent(new CustomEvent('vista:nfc-scan',{detail:{uid:" + JSONObject.quote(uid) + ",source:'android-reader-mode'}}));";
        webView.evaluateJavascript(script, null);
        Toast.makeText(this, "VISTA badge captured", Toast.LENGTH_SHORT).show();
    }

    private void updateNfcStatus() {
        String dashboardLabel;
        String toolbarLabel;
        int color;
        if (nfcAdapter == null) {
            dashboardLabel = "NFC unavailable";
            toolbarLabel = "NO NFC";
            color = R.color.vista_orange;
        } else if (!nfcAdapter.isEnabled()) {
            dashboardLabel = "Enable NFC";
            toolbarLabel = "NFC OFF";
            color = R.color.vista_orange;
        } else {
            dashboardLabel = "NFC reader ready";
            toolbarLabel = "NFC READY";
            color = R.color.vista_green;
        }
        dashboardNfcStatus.setText(dashboardLabel);
        dashboardNfcStatus.setTextColor(getColor(color));
        nfcStatus.setText(toolbarLabel);
    }

    private void configureConnectivity() {
        connectivityManager = getSystemService(ConnectivityManager.class);
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override public void onAvailable(@NonNull Network network) { mainHandler.post(() -> updateNetworkStatus(true)); }
            @Override public void onLost(@NonNull Network network) { mainHandler.post(() -> updateNetworkStatus(isConnected())); }
            @Override public void onCapabilitiesChanged(@NonNull Network network, @NonNull NetworkCapabilities capabilities) {
                mainHandler.post(() -> updateNetworkStatus(capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)));
            }
        };
        try { connectivityManager.registerDefaultNetworkCallback(networkCallback); }
        catch (Exception ignored) { }
        updateNetworkStatus(isConnected());
    }

    private boolean isConnected() {
        if (connectivityManager == null) return false;
        Network network = connectivityManager.getActiveNetwork();
        NetworkCapabilities capabilities = network == null ? null : connectivityManager.getNetworkCapabilities(network);
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void updateNetworkStatus(boolean connected) {
        networkStatus.setText(connected ? "● Connected" : "● Offline");
        networkStatus.setTextColor(getColor(connected ? R.color.vista_green : R.color.vista_orange));
        if (!connected && webWorkspaceVisible) offlinePanel.setVisibility(View.VISIBLE);
        else if (connected) offlinePanel.setVisibility(View.GONE);
    }

    private boolean isVistaUri(Uri uri) {
        return uri != null && "https".equalsIgnoreCase(uri.getScheme()) && "kyblueoval.github.io".equalsIgnoreCase(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/Ford-Energy-VISTA/");
    }

    private boolean isAllowedInApp(Uri uri) {
        if (isVistaUri(uri)) return true;
        if (uri == null || !"https".equalsIgnoreCase(uri.getScheme())) return false;
        String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(Locale.US);
        return host.equals("script.google.com") || host.endsWith(".googleusercontent.com") || host.equals("drive.google.com");
    }

    private boolean contains(String[] values, String target) {
        if (values == null) return false;
        for (String value : values) if (target.equals(value)) return true;
        return false;
    }

    private String safeError(Exception error) {
        String message = error.getMessage();
        if (message == null || message.trim().isEmpty()) return "VISTA sign-in could not be completed. Check the connection and retry.";
        return message;
    }

    @Override protected void onDestroy() {
        if (connectivityManager != null && networkCallback != null) {
            try { connectivityManager.unregisterNetworkCallback(networkCallback); }
            catch (Exception ignored) { }
        }
        cancelFileChooser();
        networkExecutor.shutdownNow();
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }

    private static final class Workspace {
        final String title;
        final String url;
        final String permission;
        Workspace(String title, String url, String permission) {
            this.title = title;
            this.url = url;
            this.permission = permission;
        }
    }
}
