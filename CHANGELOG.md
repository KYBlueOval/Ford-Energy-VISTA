## VISTA 2.3.3 — Shift Handoff and Reconciliation

- Replaced native grey live-accountability controls with consistent Ford-blue gradient actions.
- Added an accessible refresh icon, loading animation, hover, focus, and responsive button behavior.
- Added Officer Handoff & Reconciliation to Security Operations.
- Captured immutable live snapshots of visitors onsite, overdue visits, badges out, and lost/broken badge exceptions.
- Added shift/post labels, required officer notes, recent handoff history, and unresolved-item indicators.
- Added the `ShiftHandoffs` data sheet and audit events for every recorded handoff.
- Preserved all v2.3.2 active-visitor, photo, badge, role-permission, and checkout behavior.

## VISTA 2.3.2 — Active Visitor Accountability

- Added a live Active Visitors and Badges Out workspace to Security Operations.
- Added current onsite duration, expected departure, sponsor, escort, badge number, and overdue indicators.
- Added quick Open / Check Out access from each onsite visitor card.
- Added live counts for visitors onsite, issued badges, overdue visits, and lost/broken badge exceptions.
- Added a badge exception queue for shift accountability and Administration follow-up.
- Added automatic onsite-duration updates and manual live-view refresh.
- Preserved the existing visitor list, record workspace, photo loading, permissions, and checkout controls.

## VISTA 2.3.1A — Account Lock Recovery Hotfix

- Added an Apps Script recovery function for clearing a locked account without changing its PIN.
- Added a recovery function that resets the PIN and clears the lock in one operation.
- Added locked-account counts and indicators to Identity & Access Management.
- Added an authorized Unlock action for administrators.
- Made the existing Reset PIN action explicitly clear account locks and refresh the user list.
- Added audit events for manual recovery, administrative unlocks, and recovery PIN resets.
- Preserved successful badge authentication as an automatic lock reset path.

## VISTA 2.3.1 — Security Badge Control

- Added an available-badge selector to the Security Operations check-in workflow while preserving scan-first UID entry.
- Added live badge status feedback for Available, Issued, Lost, Broken, Disabled, and unknown UIDs.
- Prevented Security and Front Desk accounts from registering unknown badge UIDs.
- Added an explicit Security Supervisor/Admin override that requires a unique visitor badge number and creates an audit event.
- Added returned-badge condition selection for Available, Broken, or Lost during checkout.
- Kept Broken and Lost badges unavailable after checkout for Administration review.
- Added badge number and condition details to visit activity and audit records.
- Updated all platform version labels to 2.3.1 without changing production configuration or branding assets.

## VISTA 2.3.0 — Badge Inventory Milestone 1

- Added an authenticated Badge Inventory workspace to Administration.
- Added badge search, status filters, counts, create/edit controls, and visitor-badge number mapping.
- Added Admin-only badge-management permissions and read-only badge visibility permissions for operational roles.
- Blocked Lost, Broken, and Disabled badges from visitor check-in.
- Locked issued badge records to the Security Operations return/check-out workflow.
- Added badge-management audit events and normalized badge-reader UID matching.
- Removed horizontal footer overflow across Registration, Security Operations, and Administration.
- Preserved production Apps Script configuration keys, Drive folder IDs, public registration configuration, and Ford Energy assets.

## VISTA 2.2.2D
- Standardized Visitor Registration, Security Operations, and Administration on one full-width premium footer.
- Added layered Ford blue gradient, top highlight, subtle reflection and depth.
- Corrected Administration footer width mismatch.
- Preserved all 2.2.2A operational fixes.

# VISTA 2.2.2C

- Restored the Home Dashboard footer and its original BWRDO asset without modification.
- Rebuilt Registration, Security Operations, and Administration with a compact Ford blue module footer.
- Added a tightly cropped footer-only BWRDO derivative so the standard logo remains proportionate and visible without enlarging the footer.
- Preserved all 2.2.2A workflow and backend fixes.

## 2.2.2A — Workflow Stability Increment

- Fixed Administration Edit User modal close, Cancel, Escape, and backdrop behavior.
- Prevented cancel controls from accidentally submitting the user form.
- Hardened session/user resolution by permanent UserID with username fallback.
- Added duplicate-username validation and clearer stale-record errors.
- Preserved active sessions when an administrator edits their own username or role.
- Added saving-state feedback for user and photo updates.
- Added BadgeInventory UID-to-BadgeNumber display in Security Operations.
- Added 12-second auto-dismiss operation-complete dialogs with Close Now.
- Added centered BWRDO branding to module footers and synchronized version labels.

# Ford Energy VISTA Changelog

## 2.2.1 — Operational Badge and Checkout Dialogs
- Added guided badge-assignment and visitor check-in dialog with a review-and-confirm step.
- Added guided badge-return and visitor checkout dialog with badge verification.
- Added authenticated visitor activity and badge-history timeline to the Visitor Record workspace.
- Added related history for a badge UID across prior visitor assignments.
- Preserved server-side approval, badge-availability, and returned-badge validation.
- Added responsive modal and timeline styling for desktop and mobile operations.

## 2.1D — Lazy-Loaded User and Visitor Thumbnails
- Added authenticated profile-photo thumbnails to Identity & Access Management user rows.
- Added authenticated visitor-photo thumbnails to Security Operations visitor rows.
- Added in-session photo caching and request de-duplication to prevent repeated Drive downloads.
- Limited visitor thumbnail retrieval to four concurrent requests for responsive dashboard loading.
- Preserved initials and placeholder fallbacks when photos are missing or unavailable.
- Reused cached visitor images in the full Visitor Record panel.

## 2.1B — Operational RBAC & Workflow Reliability
- Added explicit Security Supervisor approval and denial authority.
- Removed approval and denial permissions from ordinary Security and Front Desk users while retaining check-in, checkout, badge, and no-show operations.
- Normalized legacy Visit ID payload keys (`VisitID`, `visitID`, and `visitid`) to prevent missing-required-field failures.
- Added server-side status-transition validation to prevent invalid approvals, denials, and no-show changes.
- Added visitor-photo lookup fallback by `PhotoFileName` for older records missing a usable Drive file ID or URL.
- Added confirmation prompts and temporary action locking for Security Console status changes.
- Updated Administration role filtering and module version identifiers.

# Sprint 2.0A Build 2.1

- Fixed the missing `Visitor • Information • Security • Tracking • Analytics` lockup on the Visitor Pre-Arrival Registration page.
- Forced the registration header center lockup to remain visible and centered on desktop.
- Preserved the Save Draft control on the upper-right.

# Sprint 2.0A Build 2

- Rebuilt the VISTA home page as a Ford Energy enterprise application landing experience.
- Added the standardized VISTA global header to Home, Visitor Registration, and Security Operations.
- Centered the semi-transparent acronym expansion: Visitor • Information • Security • Tracking • Analytics.
- Added page-specific descriptions beneath the acronym expansion.
- Preserved the compact Save Draft control at the upper-right of Visitor Registration.
- Preserved Security role, connection status, and sign-out controls at the upper-right of Security Operations.
- Added responsive desktop, tablet, and mobile header layouts.

# Sprint 2.0A Build 1 — Enterprise Registration & Email Branding

- Redesigned the public-registration hero with a large VISTA wordmark and smaller Visitor Pre-Arrival Registration subtitle.
- Added Ford Energy enterprise styling, improved spacing, responsive typography, and registration feature badges.
- Replaced the oversized Save Draft control with a compact pill-style button.
- Added a shared Apps Script branded email framework for VISTA notifications.
- Added the Ford Energy primary logo to every email header.
- Added BWRDO branding and the Glendale visitor administration footer to every email.
- Rebuilt sponsor, visitor, and Security emails with Outlook-compatible table layouts and inline CSS.
- Added clearer status, action-required, arrival, confirmation, and visit-detail sections.
- Updated VERSION.json to build 20002.

# Changelog

## 2.1E — Role-Based Avatar Border Colors

- Visitor thumbnails now use a neutral gray border.
- Security and Front Desk user avatars use Ford blue.
- Security Supervisor avatars use bright blue.
- Admin and Super Administrator avatars retain the green border.
- Sponsor, Approver, and neutral fallback colors are reserved for future modules.
- Role-color logic is centralized and applied to header avatars and Administration user rows.


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


## v1.3.0 Sprint 1.8a
- Added Ford Energy favicon branding to the landing page, Visitor Registration and Security Console.
- Added 16x16, 32x32, 180x180, 192x192 and 512x512 branded icons.
- Added a multi-resolution favicon.ico and site.webmanifest.
- Added Ford blue browser/PWA theme metadata.
- Preserved the GitHub Actions-owned sponsor directory.


## VISTA 2.0A — Identity & Security Core
- Added badge-first login with PIN fallback.
- Added hardened sessions and login lockout.
- Removed sponsor emails from public registration data.

## Sprint 2.0A Build 2.2 — Unified Navigation and Application Identity
- Made the complete Ford Energy/VISTA header brand lockup a Home Dashboard link on all current pages.
- Standardized browser titles as `VISTA | <Module>`.
- Preserved Ford Energy favicon and manifest references across all pages.
- Added accessible module breadcrumbs.
- Added visible Version 2.0A Build 2.2 identifiers to page footers.


## 2.1A — Administration & User Management
- Added Ford-styled Administration Console.
- Added Super Administrator role support.
- Added user create, edit, enable/disable, delete, role, badge UID, and PIN reset workflows.
- Added protected Apps Script administration endpoints and audit logging.
- Added Administration workspace to the VISTA Home Dashboard.


## 2.1B Revision 1 — Unified Access Interface
- Removed the duplicate Visitor Registration and Security Operations buttons from the Home Dashboard hero panel.
- Rebuilt Administration authentication to match Security Operations: badge UID first, username/PIN backup.
- Enforced Administrator or Super Administrator authorization after both badge and PIN login.
- Removed duplicate role options from the Administration user editor.
- Added Administration module footer and cache-busted assets.

## 2.1C
- Added managed VISTA user badge photographs stored in Google Drive and referenced in the Users sheet.
- Added signed-in circular profile photographs to Administration and Security Operations headers.
