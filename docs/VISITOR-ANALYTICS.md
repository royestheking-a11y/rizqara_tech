# Dashboard visitor analytics

The admin overview includes Website visitors, independently of inquiry/application charts.

- 7/30/90 calendar days in Asia/Dhaka.
- Page views count consented public-page navigations and reloads. Identical event IDs are deduplicated; revisits count again.
- Unique browsers use a random first-party ID, not a verified person count. Clearing storage or using another browser changes the ID.
- Paths only: no query strings, IP addresses, contact details or full user agents stored. Admin paths are rejected. Basic crawler user agents are excluded, but counts are not fraud-proof.
- Analytics consent is required. Revocation removes the browser ID. Records expire after 90 days using MongoDB TTL (cleanup is asynchronous).
- Admin authentication is required for all summary reports. Public ingestion is rate limited and validated.
- Deploy frontend and backend together. MongoDB must allow creation of the PageView unique, reporting and TTL indexes.
- No historical traffic can be backfilled automatically. Analytics zero means no qualifying recorded events in the chosen window, not necessarily zero actual visitors.
- Reports are fetched on open/range change or Refresh, not live streaming.
