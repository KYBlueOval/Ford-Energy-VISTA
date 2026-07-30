# Data Model

## VisitRequests
The authoritative visit record. Each row is one requested visit period and contains visitor identity/contact information, sponsor and department, requested access, vehicle details, agreement acknowledgements, photograph reference, check-in/out timestamps, badge UID, actual duration, and the sponsor-arrival email delivery status, recipient, timestamp, and last delivery error.

## VisitActivity
Append-only operational audit history. Events include registration submission, status updates, check-in, checkout, and sponsor arrival email delivery outcomes. Future versions can add training completion, badge replacement, and cancellation events.

## BadgeInventory
Tracks badge UID, printed number, current status, active Visit ID, issue time, and return time.

## Config
Stores deployment configuration. Do not store high-value secrets here for a production system. The pilot PIN is intentionally simple and should be replaced with approved identity-based authentication.

## EVChargingRequests
The authoritative employee EV charging access record. Each row contains employee and manager identity/contact information, the requested vehicle, policy version and content hash, acknowledgement time, manager-link token hash and expiration, approval outcome and source, employee notification status, onboarding Badge UID lookup result, Facilities notification result, and client audit metadata. The usable manager token is never stored.

## EVChargingActivity
Append-only EV request history. Events include request submission, manager or Administration decisions, and Facilities approval-email outcomes with the actor, CDSID, email, timestamp, and decision details.

## EVChargingPolicies
Versioned Ford Energy BlueOval charging policy and Terms of Use. Only active policy rows are presented to applicants. VISTA recalculates a content hash from the active text and stores that hash with each acknowledgement.

## Primary analytics fields

- `SponsorName`
- `Department`
- `Reason`
- `Project`
- `VisitorType`
- `StartDate`
- `CheckInTime`
- `CheckOutTime`
- `ActualDurationMinutes`
- `Status`
- `BadgeUID`
- `LicensePlate`

These fields support visit frequency, duration, sponsor/department workload, no-show rate, active visitor count, and badge-return compliance.
