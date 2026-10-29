import { h } from "../dom.js";
import { t } from "../../i18n/i18n.js";
import { reportService } from "../../services/report-service.js";
import { formatDate, formatShort } from "../../domain/time.js";
import { REPORT_PERIODS } from "../../domain/analytics.js";
import {
    page,
    pageHead,
    cardGrid,
    card,
    sectionTitle,
    statGrid,
    stat,
    list,
    listRow,
    badge
} from "../components/ui.js";
import { selectControl, caption } from "../components/fields.js";
import { counterRatio } from "../components/routine-row.js";

const runsPhrase = n => (n === 1
    ? t("reports.routineRunsOne")
    : t("reports.routineRuns", { count: n }));
const daysPhrase = n => (n === 1
    ? t("reports.routineDaysOne")
    : t("reports.routineDays", { count: n }));

export const reportsPage = {
    title: () => t("reports.title"),

    async mount(root) {
        const body = h("div", { class: "card-grid" });
        let period = "month";

        const { select, element } = selectControl({
            options: REPORT_PERIODS.map(p => ({ value: p, label: t(`reports.period_${p}`) })),
            value: period,
            ariaLabel: t("reports.period")
        });
        select.addEventListener("change", () => {
            period = select.value;
            this.render(body, period);
        });

        root.append(page(
            pageHead({
                title: t("reports.title"),
                icon: "chart",
                actions: h("label", { class: "head-filter" },
                    caption(t("reports.period")),
                    element
                )
            }),
            body
        ));

        await this.render(body, period);
    },

    async render(body, period) {
        const [summary, usage] = await Promise.all([
            reportService.summary(period),
            reportService.usage()
        ]);

        const periodLine = summary.from
            ? h("p", { class: "muted small" },
                t("reports.periodInfo", {
                    from: formatDate(summary.from),
                    to: formatDate(Date.now())
                }))
            : null;

        body.replaceChildren(
            card(
                sectionTitle(t("reports.time"), { icon: "clock" }),
                statGrid(
                    stat({ label: t("reports.totalTime"), value: formatShort(summary.totalMs), icon: "clock" }),
                    stat({ label: t("reports.sessionCount"), value: summary.count, icon: "history" }),
                    stat({ label: t("reports.avgSession"), value: formatShort(reportService.averageSessionMs(summary)), icon: "target" })
                ),
                periodLine
            ),
            card(
                sectionTitle(t("reports.usage"), { icon: "calendar" }),
                statGrid(
                    stat({ label: t("reports.activeDays"), value: usage.activeDays7, icon: "calendar" })
                )
            ),
            this.routineCard(summary.routine)
        );
    },

    routineCard(activity) {
        const rows = (activity?.routines ?? []).map(r => listRow({
            icon: r.kind === "counter" ? "target" : "clock",
            title: r.title,
            meta: r.kind === "counter"
                ? [
                    badge(counterRatio(r.count, r.target), { icon: "target" }),
                    badge(daysPhrase(r.days), { icon: "calendar" })
                ]
                : [
                    badge(formatShort(r.totalMs), { icon: "clock" }),
                    badge(runsPhrase(r.runs), { icon: "check" })
                ]
        }));

        return card(
            sectionTitle(t("reports.routineActivity"), { icon: "repeat" }),
            statGrid(
                stat({ label: t("reports.routineTime"), value: formatShort(activity?.totalMs ?? 0), icon: "clock" }),
                stat({ label: t("reports.routineRuns"), value: activity?.runs ?? 0, icon: "check" }),
                stat({ label: t("reports.routineCounterDays"), value: activity?.counterDays ?? 0, icon: "calendar" })
            ),
            rows.length ? list(...rows) : h("p", { class: "muted small" }, t("reports.routineNone"))
        );
    }
};