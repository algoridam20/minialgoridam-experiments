import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, multiStepTrackerStyles, multiStepTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

const TRACKERS_PER_CARD = 3;

export default {
  id: "multi-step-tracker",
  title: "Multi-Step Project Tracker",
  category: "daily",
  build() {
    const card = cardInner(multiStepTracker(TRACKERS_PER_CARD), {
      flex: true,
      className: "card-inner--multi-step",
    });
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + multiStepTrackerStyles(),
      body: a4sheet(card),
    });
  },
};
