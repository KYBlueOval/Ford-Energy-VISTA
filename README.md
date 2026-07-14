# Ford Energy VISTA v1.2.0

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


## v1.1.2 hotfix
- Corrected VisitID serialization so Approve, No Show, Check In, and Check Out actions receive `visitId`.
- Added authenticated visitor-photo retrieval from Google Drive through Apps Script.
- Corrected Google Sheets date/time display that could show 1899 timestamps for time-only fields.
- Added action notifications, selected-row highlighting, and improved photo/error states.


## v1.2.0 agreements, training, and ID-photo enhancement
- Updated visitor photo wording to government ID / passport-style standards.
- Added 3:4 ID-photo crop and optional light-blue background preparation. The background tool is a browser-side best-effort process for plain backgrounds; Security must still visually verify photo quality.
- Expanded the agreement workflow to seven separately acknowledged sections.
- Added `Agreements` and `AgreementAcknowledgements` sheets with agreement version, presented/accepted date and time, visitor-entered date, typed signature, checkbox evidence, session metadata, user agent, content hash, and completion status.
- Added configurable Site Awareness Training video support.
- Added visitor confirmation email, sponsor/security notification, confirmation QR, visit summary, arrival instructions, parking instructions, restricted-item reminder, and optional VGS navigation link.

### Required upgrade steps
1. Replace the GitHub repository files with this package.
2. Replace Apps Script `Code.gs` and save.
3. Run `setupVisitorManagement()` once. Existing visit data is preserved; missing columns and new sheets are added.
4. Update the `Config` sheet values for `TRAINING_VIDEO_URL`, `VGS_NAVIGATION_URL`, `NOTIFICATION_EMAIL`, and any arrival/parking wording.
5. Deploy Apps Script as a **new version** of the existing Web app.
6. Confirm the `/exec` URL. If Google changes it, update both frontend `config.js` files.
