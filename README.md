# Notes

Notes is a simple, local-first personal application for notes, follow-ups, routines and habits, pages, kanban organization, reports, and device settings.

It keeps your records on this device by default. Nothing is sent anywhere unless you choose to create and use a sync key.

## Features

- Later / follow-up items with dates
- Routines and habits, including counters and timed routines backed by an internal timer
- Pages and page items, including pointers to Later items
- Kanban board over Later/Page references
- Attachments (description + local bytes, bytes stay local)
- Derived log and routine/habit activity reports
- Backup, restore, and optional encrypted sync
- PWA installable offline app
- Device integration such as wake lock and notifications for timed routines

## Run locally

```sh
npm ci
npm run build
npm run dev
```

Then open http://127.0.0.1:8080.

Requirements:

- Node.js >= 20
- PHP >= 8.0 with pdo_sqlite and mbstring

## Build

```sh
npm ci
npm run build
```

## Data and privacy

Records are stored in this browser's IndexedDB. No analytics or tracking is included.

- `noteMedia` (attachment bytes) is local-only and never syncs or appears in backups.
- Sync is optional, off by default, and end-to-end encrypted.
- Timed routines use the app's internal timer support; there is no public Sessions feature screen by default.

## Development

```sh
npm run test:client
npm run test:api
npm run check:i18n
```

## License

Notes is licensed under AGPL-3.0-or-later. See [LICENSE](LICENSE).