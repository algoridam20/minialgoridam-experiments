export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function nextMonth(year, month) {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

export function listMonths(fromYear, fromMonth, toYear, toMonth) {
  const months = [];
  let year = fromYear;
  let month = fromMonth;

  while (year < toYear || (year === toYear && month <= toMonth)) {
    months.push({ year, month });
    ({ year, month } = nextMonth(year, month));
  }

  return months;
}

/** Pairs months for A4 sheets (top row + bottom row). Odd final month is duplicated on both rows. */
export function monthPagePairs(fromYear, fromMonth, toYear, toMonth) {
  const months = listMonths(fromYear, fromMonth, toYear, toMonth);
  const pairs = [];

  for (let i = 0; i < months.length; i += 2) {
    pairs.push({
      primary: months[i],
      secondary: months[i + 1] ?? months[i],
    });
  }

  return pairs;
}

/** @returns {{ day: number | null, inMonth: boolean }[]} 42 cells, Sunday-first */
export function buildCalendarCells(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const day = i - firstDay + 1;
    if (day >= 1 && day <= daysInMonth) {
      cells.push({ day, inMonth: true });
    } else {
      cells.push({ day: null, inMonth: false });
    }
  }

  return cells;
}
