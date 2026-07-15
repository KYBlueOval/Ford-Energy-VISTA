# Changelog

## v1.3.0 Sprint 1.7.1
- Replaced CORS-blocked registration fetch with an Apps Script iframe submission bridge.
- Added richer registration confirmation screen and notification delivery status.
- Added automatic sponsor, visitor, and optional Security email notifications.
- Returns stored photo filename and email outcomes after submission.

# Changelog

## v1.3.0 Sprint 1.1
- Fixed sponsor directory loading from GitHub Pages by adding a public GET endpoint with POST fallback.
- Added cache busting and robust Apps Script redirect handling.
- Normalized Sponsors sheet headers and Active values.
- Added sponsor count diagnostics in the registration picker.

# Ford Energy VISTA Changelog

## v1.3.0 Sprint 1
- Replaced the broken sponsor-email datalist with a single searchable sponsor picker.
- Searches sponsor name, email, department, and SearchKeywords.
- Selecting a sponsor automatically fills name, email, department, and hidden SponsorID.
- Added explicit “My sponsor is not listed” manual-entry mode.
- Added SponsorID and SponsorSource to VisitRequests through non-destructive setup migration.
- Preserved the production public-registration/config.js exactly.
- Retained v1.2.4 header, video, agreements, photo naming, and security-console functionality.


## v1.3.0 Sprint 1.2 — Sponsor Directory JSONP Hotfix
- Replaced cross-origin sponsor directory loading with Apps Script JSONP support.
- Retained GET/fetch fallback.
- Added cache-busting for the public registration app script.
- Preserved production config.js unchanged.

## v1.3.0 Sprint 1.5
- Replaced cross-origin Apps Script sponsor lookup with same-origin `public-registration/data/sponsors.json`.
- Removed JSONP/CORS/iframe bridge dependency for sponsor search.
- Preserved production `config.js` unchanged.

## v1.3.0 Sprint 1.6
- Added GitHub Actions synchronization from the Google Sheets `Sponsors` tab through the Apps Script `listSponsors` endpoint.
- Added server-side sponsor JSON validation and change-only commits.
- Registration now uses the same-origin generated sponsor directory with local browser cache fallback.
- Preserved the production `public-registration/config.js` unchanged.

## v1.3.0 Sprint 1.7
- Added sponsor directory freshness/status display and manual refresh.
- Added tokenized relevance-ranked sponsor search.
- Added resilient automatic draft saving, restore notification, and discard control.
- Replaced blocked Google Drive iframe training playback with a reliable secure launch workflow.
- Included the verified Sprint 1.6.3 sponsor synchronization GitHub Action.


## v1.3.0 Sprint 1.7.2
- Restored the Google Drive embedded training-video player with a visible new-tab fallback.
- Reworked registration submission to use hidden-form POST plus JSONP status polling.
- Added Apps Script submission-result caching to prevent postMessage-only timeouts.
- Extended the submission timeout to three minutes with duplicate-submission guidance.
- Preserved automatic sponsor, visitor, and Security email notifications.
- Release packages no longer include or overwrite the generated `public-registration/data/sponsors.json` file.

## v1.3.0 Sprint 1.8.0
- Added requested visitor lifecycle status colors.
- Fixed Security Console photo loading and canonical download filenames.
- Added header-safe row writing and one-time VisitRequests header repair with backup.
