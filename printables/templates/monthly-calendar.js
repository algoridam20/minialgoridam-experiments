import { a4sheetVariants, cardInner } from "../lib/layout.js";
import { blockStyles, monthlyCalendarStyles, monthlyCalendar } from "../lib/blocks.js";
import { printableDocument } from "../lib/document.js";
import { MONTH_NAMES, monthPagePairs } from "../lib/calendar.js";

const RANGE = {
  from: { year: 2026, month: 7 },
  to: { year: 2027, month: 4 },
};

function calendarCard(year, month) {
  return cardInner(monthlyCalendar(year, month), {
    flex: true,
    className: "card-inner--calendar",
  });
}

function calendarSheet(primary, secondary) {
  const top = calendarCard(primary.year, primary.month);
  const bottom = calendarCard(secondary.year, secondary.month);
  return a4sheetVariants({ tl: top, tr: top, bl: bottom, br: bottom });
}

export default {
  id: "monthly-calendar",
  title: "Monthly Calendar",
  category: "monthly",
  build() {
    const { from, to } = RANGE;
    const pairs = monthPagePairs(from.year, from.month, to.year, to.month);
    const pages = pairs.map(({ primary, secondary }) => calendarSheet(primary, secondary));

    const fromName = MONTH_NAMES[from.month - 1];
    const toName = MONTH_NAMES[to.month - 1];
    const pageTitle = `${fromName} ${from.year} – ${toName} ${to.year}`;

    return printableDocument({
      title: pageTitle,
      extraStyles: blockStyles() + monthlyCalendarStyles(),
      pages,
    });
  },
};
