import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, multiStepSection } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

export default {
  id: "multi-step-tracker",
  title: "Multi-Step Project Tracker",
  category: "daily",
  build() {
    const card = cardInner(
      multiStepSection() + multiStepSection() + multiStepSection(true),
      { flex: true }
    );
    return printablePage({
      title: this.title,
      extraStyles: blockStyles(),
      body: a4sheet(card),
    });
  },
};
