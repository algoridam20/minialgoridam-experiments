import { a4sheetVariants, cardInner } from "../lib/layout.js";
import { blockStyles, flowStateTrackerStyles, flowStateTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

function flowStateCard() {
  return cardInner(flowStateTracker(), {
    flex: true,
    className: "card-inner--flow-state",
  });
}

export default {
  id: "flow-state-ritual-tracker",
  title: "Flow State Ritual Tracker",
  category: "daily",
  build() {
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + flowStateTrackerStyles(),
      body: a4sheetVariants({
        tl: flowStateCard(),
        tr: flowStateCard(),
        bl: flowStateCard(),
        br: flowStateCard(),
      }),
    });
  },
};
