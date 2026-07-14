# Data Model

## VisitRequests
The authoritative visit record. Each row is one requested visit period and contains visitor identity/contact information, sponsor and department, requested access, vehicle details, agreement acknowledgements, photograph reference, check-in/out timestamps, badge UID, and actual duration.

## VisitActivity
Append-only operational audit history. Events include registration submission, status updates, check-in, and checkout. Future versions can add sponsor approval, training completion, badge replacement, and cancellation events.

## BadgeInventory
Tracks badge UID, printed number, current status, active Visit ID, issue time, and return time.

## Config
Stores deployment configuration. Do not store high-value secrets here for a production system. The pilot PIN is intentionally simple and should be replaced with approved identity-based authentication.

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
