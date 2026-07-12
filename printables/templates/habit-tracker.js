import { a4sheet } from "../lib/layout.js";
import { blockStyles, dateRow, grid, slantedLines } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

const COLS = 20;
const ROWS = 31;

export default {
  id: "habit-tracker",
  title: "Monthly Habit Tracker",
  category: "monthly",
  build() {
    const card = dateRow(ROWS) + grid(COLS, ROWS) + slantedLines(COLS, { gridRows: ROWS });
    return printablePage({
      title: this.title,
      extraStyles: blockStyles(),
      body: a4sheet(card),
    });
  },
};
