package com.fordenergy.vista;

import android.Manifest;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.IOException;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String BASE_URL = "https://kyblueoval.github.io/Ford-Energy-VISTA/";
    private static final int FILE_CHOOSER_REQUEST = 702;
    private static final int CAMERA_PERMISSION_REQUEST = 703;

    private WebView webView;
    private TextView nfcStatus;
    private NfcAdapter nfcAdapter;
    private PendingIntent nfcIntent;
    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;
    private PermissionRequest pendingWebPermission;
    private boolean waitingForCameraChooser;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        buildInterface();
        configureWebView();
        configureNfc();
        if (state == null) webView.loadUrl(BASE_URL);
        else webView.restoreState(state);
        handleNfcIntent(getIntent());
    }

    private void buildInterface() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.WHITE);

        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setOrientation(LinearLayout.HORIZONTAL);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(8), dp(6), dp(8), dp(6));
        toolbar.setBackgroundColor(Color.rgb(0, 52, 120));

        toolbar.addView(navButton("Home", ""));
        toolbar.addView(navButton("Register", "public-registration/"));
        toolbar.addView(navButton("Security", "security-console/"));
        toolbar.addView(navButton("Admin", "admin-console/"));

        nfcStatus = new TextView(this);
        nfcStatus.setTextColor(Color.WHITE);
        nfcStatus.setTextSize(11);
        nfcStatus.setGravity(Gravity.END | Gravity.CENTER_VERTICAL);
        nfcStatus.setPadding(dp(8), 0, 0, 0);
        toolbar.addView(nfcStatus, new LinearLayout.LayoutParams(0, dp(44), 1));

        webView = new WebView(this);
        root.addView(toolbar, new LinearLayout.LayoutParams(-1, -2));
        root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
    }

    private Button navButton(String label, String path) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextSize(10);
        button.setTextColor(Color.WHITE);
        button.setAllCaps(false);
        button.setBackgroundColor(Color.TRANSPARENT);
        button.setOnClickListener(v -> webView.loadUrl(BASE_URL + path));
        return button;
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
        settings.setUserAgentString(settings.getUserAgentString() + " FordEnergyVISTA-Android/2.3.7");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equalsIgnoreCase(uri.getScheme()) &&
                    ("kyblueoval.github.io".equalsIgnoreCase(uri.getHost()) ||
                     uri.getHost().endsWith(".google.com") ||
                     uri.getHost().endsWith(".googleusercontent.com"))) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                catch (ActivityNotFoundException ignored) { }
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> {
                    boolean cameraRequested = false;
                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) cameraRequested = true;
                    }
                    if (!cameraRequested) {
                        request.deny();
                        return;
                    }
                    if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                    } else {
                        pendingWebPermission = request;
                        requestPermissions(new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
                    }
                });
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

    private void launchImageChooser() {
        Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
        pick.addCategory(Intent.CATEGORY_OPENABLE);
        pick.setType("image/*");

        Intent camera = null;
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                waitingForCameraChooser = true;
                requestPermissions(new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
                return;
            } else {
                try {
                    File directory = new File(getCacheDir(), "camera");
                    if (!directory.exists()) directory.mkdirs();
                    File photo = File.createTempFile("VISTA-", ".jpg", directory);
                    cameraUri = FileProvider.getUriForFile(this, getPackageName() + ".files", photo);
                    camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    camera.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                    camera.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                } catch (IOException ignored) { }
            }
        }

        Intent chooser = Intent.createChooser(pick, "VISTA photo");
        if (camera != null) chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
        startActivityForResult(chooser, FILE_CHOOSER_REQUEST);
    }

    private void configureNfc() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        nfcIntent = PendingIntent.getActivity(this, 0,
            new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        updateNfcStatus();
    }

    private void updateNfcStatus() {
        if (nfcAdapter == null) nfcStatus.setText("NFC unavailable");
        else if (!nfcAdapter.isEnabled()) nfcStatus.setText("Enable NFC");
        else nfcStatus.setText("NFC ready");
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
        handleNfcIntent(intent);
    }

    private void handleNfcIntent(Intent intent) {
        if (intent == null || !NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction())) return;
        @SuppressWarnings("deprecation")
        Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        if (tag == null || tag.getId() == null) return;
        StringBuilder uid = new StringBuilder();
        for (byte value : tag.getId()) uid.append(String.format(Locale.US, "%02X", value));
        deliverNfcUid(uid.toString());
    }

    private void deliverNfcUid(String uid) {
        nfcStatus.setText("Read " + uid);
        String safeUid = uid.replace("\\", "\\\\").replace("'", "\\'");
        webView.evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('vista:nfc-scan',{detail:{uid:'" + safeUid + "',source:'android-nfc'}}));",
            null
        );
        Toast.makeText(this, "VISTA badge read", Toast.LENGTH_SHORT).show();
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
        if (requestCode == CAMERA_PERMISSION_REQUEST && pendingWebPermission != null) {
            if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED)
                pendingWebPermission.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
            else pendingWebPermission.deny();
            pendingWebPermission = null;
        }
        if (requestCode == CAMERA_PERMISSION_REQUEST && waitingForCameraChooser) {
            waitingForCameraChooser = false;
            launchImageChooser();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
