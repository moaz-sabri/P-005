import { h } from "../dom.js";
import { t } from "../../i18n/i18n.js";
import { page, pageHead, pageSection, card } from "../components/ui.js";

const item = (title, text) => h("div", { class: "help-item" },
    h("h3", {}, title),
    h("p", { class: "muted" }, text)
);

export const helpPage = {
    title: () => t("help.title"),
    mount(root) {
        root.append(page(
            pageHead({ title: t("help.title"), icon: "info" }),
            pageSection({
                title: t("help.startTitle"),
                body: card(
                    item(t("help.startOne"), t("help.startOneText")),
                    item(t("help.startTwo"), t("help.startTwoText")),
                    item(t("help.startThree"), t("help.startThreeText"))
                )
            }),
            pageSection({
                title: t("help.areasTitle"),
                body: card(
                    item(t("help.later"), t("help.laterText")),
                    item(t("help.routines"), t("help.routinesText")),
                    item(t("help.pages"), t("help.pagesText")),
                    item(t("help.kanban"), t("help.kanbanText")),
                    item(t("help.reports"), t("help.reportsText"))
                )
            }),
            pageSection({
                title: t("help.dataTitle"),
                body: card(item(t("help.data"), t("help.dataText")))
            })
        ));
    }
};
