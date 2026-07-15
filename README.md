# Ford Energy VISTA v1.3.0 Sprint 1.8



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


## v1.2.2 agreements, training, and ID-photo enhancement
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

## v1.2.2 visitor-photo naming

New visitor photographs are saved in the configured Google Drive folder as `Full Name-Company.jpg` or `.png`, for example `John Alan Doe-Clarion.jpg`. The Security Console also provides a Download Photo control that preserves that exact filename for Alpeta/uBio facial-recognition enrollment.


## v1.2.2
Adds a searchable approved sponsor email directory with automatic sponsor name/department population and manual unlisted-email entry.


## v1.2.4

- Searchable sponsor directory with manual email entry remains enabled.
- Replaces the former color-threshold photo effect with MediaPipe person segmentation and a solid light-blue ID-photo background.
- Adds Google Drive preview embedding, YouTube embedding, direct MP4 support, and a visible fallback link for training videos that cannot be embedded.


## v1.2.4 Registration Header Text Update

- Top-brand subtitle: `Visitor Registration - Site Access Reservation System`
- Hero location: `BlueOval Glendale KY`
- Hero title: `VISTA Visitor Pre-Arrival Registration`
