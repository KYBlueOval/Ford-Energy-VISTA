# Deployment Guide

## Part 1 — Create the Google database

1. Create a new Google Sheet named `Ford Energy Visitor Management Database`.
2. From the Sheet, open **Extensions → Apps Script**.
3. Delete the starter code in `Code.gs`.
4. Copy the contents of `apps-script/Code.gs` into the Apps Script editor.
5. In **Project Settings**, confirm the time zone is `America/New_York`.
6. Run the function `setupVisitorManagement` once.
7. Approve the requested Google permissions.
8. Return to the spreadsheet. The script creates these tabs:
   - `VisitRequests`
   - `VisitActivity`
   - `BadgeInventory`
   - `Config`

## Part 2 — Configure the backend

Open the `Config` tab.

- `SECURITY_PIN`: Change the default pilot PIN if needed.
- `PHOTO_FOLDER_ID`: Create a restricted Google Drive folder for visitor photographs and paste only its folder ID here. The ID is the portion after `/folders/` in the Drive URL.
- `SITE_TIMEZONE`: Keep `America/New_York` for Glendale.
- `NOTIFICATION_EMAIL`: Enter the Security mailbox or distribution email that should receive new-registration notices.

Keep the photograph folder restricted. The system stores a Drive file ID and a display URL in the database; access still depends on Drive permissions.

## Part 3 — Deploy Google Apps Script as a Web App

1. In Apps Script, select **Deploy → New deployment**.
2. Select deployment type **Web app**.
3. Description: `Ford Energy Visitor Management API v1.0.0`.
4. Execute as: **Me**.
5. Who has access: choose the access level approved for the pilot. A public visitor form normally requires an option that permits unauthenticated visitors. Confirm this with Ford information-security and privacy requirements before production use.
6. Select **Deploy** and complete authorization.
7. Copy the production URL ending in `/exec`. Do not use the `/dev` test URL for GitHub Pages.

When backend code changes later, use **Deploy → Manage deployments → Edit**, select a new version, and redeploy. The `/exec` URL normally remains the same for the edited deployment.

## Part 4 — Connect both web applications

Edit these two files:

- `public-registration/config.js`
- `security-console/config.js`

Replace:

```javascript
PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
```

with the copied Apps Script `/exec` URL.

Example:

```javascript
window.FE_VISITOR_CONFIG = {
  API_URL: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec",
  SITE_NAME: "Ford Energy Glendale",
  AGREEMENT_VERSION: "2026.1"
};
```

Do not place Google credentials, passwords, private keys, or OAuth secrets in GitHub.

## Part 5 — Test locally before GitHub

Because camera access normally requires HTTPS or localhost, use a local web server instead of double-clicking the HTML file.

From the project folder:

```bash
python -m http.server 8080
```

Open:

- `http://localhost:8080/public-registration/`
- `http://localhost:8080/security-console/`

Complete a test registration and confirm:

1. A row is created in `VisitRequests`.
2. The photograph appears in the configured Drive folder.
3. `REGISTRATION_SUBMITTED` appears in `VisitActivity`.
4. The request appears in the Security Console.
5. Check-in records the badge UID and arrival time.
6. Checkout verifies the same UID and calculates `ActualDurationMinutes`.
7. The badge returns to `Available` in `BadgeInventory`.

## Part 6 — Upload to GitHub

### GitHub website method

1. Create a new repository such as `FordEnergy-VisitorManagement`.
2. Set the repository visibility according to Ford policy. Note that GitHub Pages availability and access behavior depend on the GitHub plan and organization configuration.
3. Upload the contents of the project folder so `index.html` is at the repository root.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, select **Deploy from a branch**.
7. Select branch `main` and folder `/(root)`.
8. Save and wait for the deployment to finish.

The site will normally be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/FordEnergy-VisitorManagement/
```

The direct pages are:

```text
/public-registration/
/security-console/
```

### Git command-line method

```bash
git init
git add .
git commit -m "Initial Ford Energy visitor management MVP"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/FordEnergy-VisitorManagement.git
git push -u origin main
```

Then enable Pages using the same Settings steps above.

## Part 7 — Recommended pilot procedure

1. Use test visitor data only.
2. Limit the Security Console URL and PIN to pilot staff.
3. Preload several physical visitor badge UIDs in `BadgeInventory`.
4. Test arrival, badge assignment, badge mismatch, checkout, and overdue scenarios.
5. Confirm sponsor email delivery.
6. Validate the exact agreement wording with Ford Legal, Privacy, Security, HR, and EHS.
7. Establish an approved record-retention period before using real visitor records.
8. Replace PIN authentication before enterprise deployment.

## Troubleshooting

### The registration says the API URL is not configured
Update both `config.js` files with the `/exec` Apps Script URL and upload the corrected files to GitHub.

### Apps Script returns `Invalid Security PIN`
Check `SECURITY_PIN` in the `Config` tab. Remove spaces before or after the value.

### No photograph is saved
Confirm `PHOTO_FOLDER_ID` contains only the Drive folder ID and that the Apps Script owner can edit the folder.

### The GitHub page displays a 404
Confirm Pages is publishing from `main` and `/(root)`, and confirm `index.html` is at the repository root.

### Changes do not appear
Wait for the Pages deployment to complete, then hard-refresh the browser. For Apps Script changes, create a new deployment version through **Manage deployments**.
