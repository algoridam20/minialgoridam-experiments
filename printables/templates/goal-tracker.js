import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, goalTrackerStyles, goalTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

export default {
  id: "goal-tracker",
  title: "Goal Tracker",
  category: "yearly",
  build() {
    const card = cardInner(goalTracker(), {
      flex: true,
      className: "card-inner--goal",
    });
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + goalTrackerStyles(),
      body: a4sheet(card),
    });
  },
};
