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
