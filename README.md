# Ford Energy VISTA v1.1.0

**Visitor Intelligence, Security, Tracking & Analytics**

This package contains the Ford Energy branded visitor registration portal, Security Operations Console, and Google Apps Script backend.

## Live API configured

The two frontend `config.js` files are already configured for the current Apps Script `/exec` deployment.

## GitHub Pages deployment

Upload the contents of this folder to the root of the GitHub repository. Then open **Settings → Pages**, choose **Deploy from a branch**, select `main`, and select `/(root)`.

Use a web server for local testing rather than opening folders directly:

```powershell
py -m http.server 8080
```

Then open `http://localhost:8080/`.

## Google Drive photo folder

In the spreadsheet `Config` tab, set `PHOTO_FOLDER_ID` to:

```text
16MbxQNStixZZeIUpyA6OBoEAxM7aoEji
```

Keep the Drive folder restricted. Apps Script saves photos while executing as the deployment owner.
