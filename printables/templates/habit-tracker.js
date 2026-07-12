import { a4sheet } from "../lib/layout.js";
import {
  blockStyles,
  habitTrackerStyles,
  dateRowWithLabels,
  habitTracker,
} from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

const COLS = 20;
const ROWS = 31;

export default {
  id: "habit-tracker",
  title: "Monthly Habit Tracker",
  category: "monthly",
  build() {
    const card = dateRowWithLabels(ROWS) + habitTracker(COLS, ROWS);
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + habitTrackerStyles(COLS, ROWS),
      body: a4sheet(card),
    });
  },
};
