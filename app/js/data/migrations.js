export const migrations = {
    1(db) {
        db.createObjectStore("meta", { keyPath: "key" });
        db.createObjectStore("outbox", { keyPath: "key" });

        const sessions = db.createObjectStore("sessions", { keyPath: "id" });
        sessions.createIndex("startedAt", "startedAt");
        sessions.createIndex("taskId", "taskId");
        sessions.createIndex("status", "status");
        sessions.createIndex("activeSlot", "activeSlot", { unique: true });

        const events = db.createObjectStore("events", { keyPath: "id" });
        events.createIndex("sessionId", "sessionId");

        db.createObjectStore("later", { keyPath: "id" });

        db.createObjectStore("pages", { keyPath: "id" });

        const pageItems = db.createObjectStore("pageItems", { keyPath: "id" });
        pageItems.createIndex("pageId", "pageId");

        const noteMedia = db.createObjectStore("noteMedia", { keyPath: "id" });
        noteMedia.createIndex("noteId", "noteId");

        const kanbanItems = db.createObjectStore("kanbanItems", { keyPath: "id" });
        kanbanItems.createIndex("status", "status");
        kanbanItems.createIndex("originalKey", "originalKey", { unique: true });
        kanbanItems.createIndex("service", "service");
        kanbanItems.createIndex("dueAt", "dueAt");
        kanbanItems.createIndex("todayKey", "todayKey");

        db.createObjectStore("routines", { keyPath: "id" });

        const routineLogs = db.createObjectStore("routineLogs", { keyPath: "id" });
        routineLogs.createIndex("routineId", "routineId");
        routineLogs.createIndex("dayKey", "dayKey");
    }
};