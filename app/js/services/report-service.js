import { withTx } from "../data/db.js";
import { reader } from "../data/stores.js";
import { reportSummary, homeGlance, activeDays, averageSessionMs } from "../domain/analytics.js";

const sessions = reader("session");
const later = reader("later");
const routines = reader("routine");
const routineLogs = reader("routineLog");
const pages = reader("page");

export const reportService = {
    async summary(period = "month", now = Date.now()) {
        const data = await withTx(
            ["sessions", "later", "routines", "routineLogs"],
            "readonly",
            async r => ({
                sessions: await sessions(r).getAll(),
                later: await later(r).getAll(),
                routines: await routines(r).getAll(),
                routineLogs: await routineLogs(r).getAll()
            })
        );
        return reportSummary(data, period, now);
    },

    async usage(now = Date.now()) {
        const all = await withTx(["sessions"], "readonly", r => sessions(r).getAll());
        return { activeDays7: activeDays(all, 7, now) };
    },

    async glance(now = Date.now()) {
        const data = await withTx(
            ["sessions", "later", "routines", "pages"],
            "readonly",
            async r => ({
                sessions: await sessions(r).getAll(),
                later: await later(r).getAll(),
                routines: await routines(r).getAll(),
                pages: await pages(r).getAll()
            })
        );
        return homeGlance(data, now);
    },

    averageSessionMs
};