import { a4sheetVariants, cardInner } from "../lib/layout.js";
import { blockStyles, monthlyCalendarStyles, monthlyCalendar } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";
import { MONTH_NAMES, nextMonth } from "../lib/calendar.js";

// Edit before build — top row uses this month; bottom row uses the following month.
const YEAR = 2026;
const MONTH = 7;

function calendarCard(year, month) {
  return cardInner(monthlyCalendar(year, month), {
    flex: true,
    className: "card-inner--calendar",
  });
}

export default {
  id: "monthly-calendar",
  title: "Monthly Calendar",
  category: "monthly",
  build() {
    const following = nextMonth(YEAR, MONTH);
    const monthName = MONTH_NAMES[MONTH - 1];
    const nextName = MONTH_NAMES[following.month - 1];
    const pageTitle = `${monthName} ${YEAR} & ${nextName} ${following.year}`;
    const primary = calendarCard(YEAR, MONTH);
    const secondary = calendarCard(following.year, following.month);

    return printablePage({
      title: pageTitle,
      extraStyles: blockStyles() + monthlyCalendarStyles(),
      body: a4sheetVariants({
        tl: primary,
        tr: primary,
        bl: secondary,
        br: secondary,
      }),
    });
  },
};
