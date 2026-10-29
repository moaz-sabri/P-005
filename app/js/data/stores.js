import { sessionsRepo } from "./sessions.repo.js";
import { eventsRepo } from "./events.repo.js";
import { laterRepo } from "./later.repo.js";
import { noteMediaRepo } from "./note-media.repo.js";
import { pagesRepo } from "./pages.repo.js";
import { pageItemsRepo } from "./page-items.repo.js";
import { kanbanItemsRepo } from "./kanban-items.repo.js";
import { routinesRepo } from "./routines.repo.js";
import { routineLogsRepo } from "./routine-logs.repo.js";
import { ValidationError } from "../domain/errors.js";
import {
    MAX_SESSIONS,
    MAX_LATER_ITEMS,
    MAX_PAGES,
    MAX_PAGE_ITEMS,
    MAX_KANBAN_ITEMS,
    MAX_ROUTINES,
    MAX_ROUTINE_LOGS
} from "../domain/validation.js";

export const RECORDS = Object.freeze([
    {
        type: "session",
        store: "sessions",
        backupKey: "sessions",
        repo: sessionsRepo,
        quota: { field: "sessions", max: MAX_SESSIONS, code: "sessions_limit" }
    },
    { type: "event", store: "events", backupKey: "events", repo: eventsRepo, quota: null },
    {
        type: "later",
        store: "later",
        backupKey: "later",
        repo: laterRepo,
        quota: { field: "later", max: MAX_LATER_ITEMS, code: "later_limit" }
    },
    {
        type: "page",
        store: "pages",
        backupKey: "pages",
        repo: pagesRepo,
        quota: { field: "pages", max: MAX_PAGES, code: "pages_limit" }
    },
    {
        type: "pageItem",
        store: "pageItems",
        backupKey: "pageItems",
        repo: pageItemsRepo,
        quota: { field: "pageItems", max: MAX_PAGE_ITEMS, code: "page_items_limit" }
    },
    {
        type: "kanbanItem",
        store: "kanbanItems",
        backupKey: "kanbanItems",
        repo: kanbanItemsRepo,
        quota: { field: "kanbanItems", max: MAX_KANBAN_ITEMS, code: "kanban_items_limit" }
    },
    {
        type: "routine",
        store: "routines",
        backupKey: "routines",
        repo: routinesRepo,
        quota: { field: "routines", max: MAX_ROUTINES, code: "routines_limit" }
    },
    {
        type: "routineLog",
        store: "routineLogs",
        backupKey: "routineLogs",
        repo: routineLogsRepo,
        quota: { field: "routineLogs", max: MAX_ROUTINE_LOGS, code: "routine_logs_limit" }
    }
]);

export const LOCAL_STORES = Object.freeze(["meta", "outbox", "noteMedia"]);

const localRepos = new Map([["noteMedia", noteMediaRepo]]);

export function localReader(store) {
    const repo = localRepos.get(store);
    if (!repo) throw new Error(`no local repo for store: ${store}`);
    return r => repo(r[store]);
}

export const VOCABULARY_TYPES = Object.freeze([]);

const byType = new Map(RECORDS.map(r => [r.type, r]));
const byName = new Map(RECORDS.flatMap(r => [[r.type, r], [r.store, r]]));

export const SYNC_TYPES = Object.freeze(RECORDS.map(r => r.type));
export const SYNCED_STORES = Object.freeze(Object.fromEntries(RECORDS.map(r => [r.type, r.store])));
export const BACKUP_STORES = Object.freeze(RECORDS.map(r => r.store));

export function recordFor(name) {
    return byName.get(name);
}

export function repoFor(name) {
    return byName.get(name)?.repo;
}

export function reader(type) {
    const record = byName.get(type);
    if (!record) throw new Error(`unknown record type: ${type}`);
    return r => record.repo(r[record.store]);
}

export async function guardQuota(r, type) {
    const record = byName.get(type);
    if (!record) throw new Error(`unknown record type: ${type}`);
    if (!record.quota) return;
    const { field, max, code } = record.quota;
    if (await record.repo(r[record.store]).count() >= max) {
        throw new ValidationError(field, code);
    }
}
