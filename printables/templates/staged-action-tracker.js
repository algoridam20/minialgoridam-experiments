import { a4sheetVariants, cardInner } from "../lib/layout.js";
import { blockStyles, stagedActionTrackerStyles, stagedActionTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";
import { tokens as t } from "../lib/tokens.js";

function stagedActionCard(count, { dense = false } = {}) {
  const className = ["card-inner--staged-action", dense && "card-inner--staged-action-dense"]
    .filter(Boolean)
    .join(" ");
  return cardInner(stagedActionTracker(count), { flex: true, className });
}

export default {
  id: "staged-action-tracker",
  title: "Staged Action Tracker",
  category: "daily",
  build() {
    const relaxed = stagedActionCard(t.stagedAction.itemsRelaxed);
    const dense = stagedActionCard(t.stagedAction.itemsDense, { dense: true });

    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + stagedActionTrackerStyles(),
      body: a4sheetVariants({ tl: relaxed, tr: dense, bl: relaxed, br: dense }),
    });
  },
};
