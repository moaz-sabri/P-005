# AGENTS.md

This file provides unified work rules for AI agents and future editors of Notes.

## Project identity

Notes is a small, local-first personal application for notes, follow-ups, routines and habits, pages, kanban organization, reports, backup, sync, and device integration.

Core user-facing dimensions:
- Later / notes / follow-up items
- Routines / habits
- Pages and page items
- Kanban references
- Reports
- Settings, backup, and optional sync

Do not re-add unrelated domains such as standalone task management, finance, debts, subscriptions, or standalone session management UI unless explicitly requested. Timed routines may use the internal session timer.

## Stack

- Frontend: plain ES modules, no framework, no runtime dependencies
- Backend: PHP front controller + SQLite
- Storage: IndexedDB locally, optional encrypted sync server
- Build: Webpack to `app/dist/`

## Commands

```sh
npm ci
npm run build
npm run test:client
npm run test:api
npm run check:i18n
```

## Data rules

Record types and local stores must stay synchronized across `stores.js`, `migrations.js`, `sync-service.js`, `backup-service.js`, and `api/sync.php`. Keep `noteMedia` local-only; never add it to sync or backups. Timed routines depend on `session-service.js` as internal runtime support.

## UI rules

Navigation, routes, and icons must reference only destinations that exist. The home screen should remain a glance. Prefer removing dead code over leaving unused modules. Build must succeed after any change.