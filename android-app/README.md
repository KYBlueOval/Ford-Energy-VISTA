# Ford Energy VISTA Android Operations Client

Version 2.7.0 is the Android foundation for the VISTA web suite. It uses the production GitHub Pages applications and existing Apps Script API as the authoritative system of record.

## Included workspaces

- Security Operations
- Sponsor & Approver Portal
- System Administration
- Visitor Registration
- EV Charging Access Request

## Device capabilities

- Mobile data and Wi-Fi connectivity
- NFC badge sign-in and badge UID capture
- Camera and photo-library access
- Visitor, incident, handoff, and profile-photo uploads
- VISTA deep links
- Secure external-link handling
- Offline detection and retry

NFC scans are dispatched to the active VISTA page as a `vista:nfc-scan` browser event. Existing Security Operations, Administration, and Sponsor Portal listeners consume that event.

## Build

1. Open `android-app` in Android Studio.
2. Allow Gradle to synchronize.
3. Select the `app` configuration.
4. Build and run on an Android 8.0 or newer device.

Command-line debug build:

```text
gradlew.bat assembleDebug
```

The resulting APK is written to:

```text
android-app/app/build/outputs/apk/debug/app-debug.apk
```

## Test sequence

1. Install the debug APK on an NFC-capable Android device.
2. Grant camera permission when requested.
3. Open Security Operations and sign in with a VISTA badge or username/PIN.
4. Open badge assignment or manual check-in and scan a visitor badge.
5. Confirm the UID populates the active field.
6. Open Manual Visitor Check-In and capture a visitor photo.
7. Submit an incident or handoff image and verify it reaches the configured Drive folder.
8. Test Sponsor and Administration badge sign-in.
9. Disable Wi-Fi/mobile data, verify the offline recovery screen, reconnect, and retry.

Production Apps Script and frontend configuration files are not embedded or duplicated in the Android source.
