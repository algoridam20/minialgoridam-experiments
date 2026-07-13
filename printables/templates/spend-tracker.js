import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, spendTrackerStyles, spendTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

export default {
  id: "spend-tracker",
  title: "Spend Tracker",
  category: "monthly",
  build() {
    const card = cardInner(spendTracker(), {
      flex: true,
      className: "card-inner--spend",
    });
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + spendTrackerStyles(),
      body: a4sheet(card),
    });
  },
};
