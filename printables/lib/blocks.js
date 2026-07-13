import { tokens as t } from "./tokens.js";
import { MONTH_NAMES, buildCalendarCells } from "./calendar.js";

const SLANTED_H = 12;
const LABEL_W = 4;
const DATE_TOP = 3;
const GRID_GAP = 1;
const SLANT_OFFSET = 7;

function cellMm() {
  return parseFloat(t.cell.size);
}

function dateCellMm() {
  return parseFloat(t.dateCell.size);
}

function habitLayout(cols, rows) {
  const cell = cellMm();
  const dateCell = dateCellMm();
  const cardW = parseFloat(t.card.width);
  const gridW = cols * cell;
  const gridH = rows * cell;
  const blockW = gridW + SLANT_OFFSET;
  const headerW = LABEL_W + gridW + LABEL_W;
  const contentRightMargin = 2;
  const dateHeaderLeft = cardW - contentRightMargin - headerW;
  const blockLeft = dateHeaderLeft + LABEL_W - SLANT_OFFSET;
  const gridLeft = blockLeft + SLANT_OFFSET;
  const gridTop = DATE_TOP + dateCell + GRID_GAP;

  return {
    cell,
    dateCell,
    gridW,
    gridH,
    blockW,
    blockLeft,
    gridLeft,
    dateHeaderLeft,
    gridTop,
  };
}

function numberCellStyle() {
  return `
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${t.font.date};
    font-weight: bold;
    line-height: 1;
    text-align: center;
    font-variant-numeric: tabular-nums;
    color: ${t.colors.inkMuted};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  `;
}

export function blockStyles() {
  return `
  .card-inner {
    position: absolute;
    left: ${t.padding.x};
    right: ${t.padding.x};
    top: ${t.padding.y};
    bottom: ${t.padding.y};
  }

  .card-inner--flex {
    display: flex;
    flex-direction: column;
  }

`;
}

export function multiStepTrackerStyles() {
  const gap = t.multiStep.gap;

  return `
  .card-inner--multi-step {
    left: ${gap};
    right: ${gap};
    top: ${gap};
    bottom: ${gap};
  }

  .multi-step-layout {
    display: flex;
    flex-direction: column;
    gap: ${gap};
    height: 100%;
  }

  ${projectTrackerStyles(gap)}
`;
}

export function goalTrackerStyles() {
  const gap = t.multiStep.gap;

  return `
  .card-inner--goal {
    left: ${gap};
    right: ${gap};
    top: ${gap};
    bottom: ${gap};
  }

  .goal-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  ${projectTrackerStyles(gap)}

  .tracker-why {
    display: flex;
    flex-direction: column;
    gap: 0.5mm;
    margin-bottom: ${gap};
    flex-shrink: 0;
  }

  .tracker-milestones {
    display: flex;
    flex-direction: column;
    gap: ${gap};
    margin-bottom: ${gap};
    flex-shrink: 0;
  }

  .tracker-milestone {
    display: flex;
    align-items: center;
    gap: ${gap};
  }

  .tracker-milestone-check {
    width: 3mm;
    height: 3mm;
    border: ${t.border.card};
    border-radius: ${t.border.radius};
    flex-shrink: 0;
  }

  .tracker-milestone-line {
    flex: 1;
    border-bottom: ${t.lineWidth} solid ${t.colors.fieldLine};
    height: 3.5mm;
  }
`;
}

export function stagedActionTrackerStyles() {
  const gap = t.multiStep.gap;
  const symbol = t.stagedAction.symbolSize;
  const symbolDense = t.stagedAction.symbolSizeDense;

  return `
  .card-inner--staged-action {
    left: ${gap};
    right: ${gap};
    top: ${gap};
    bottom: ${gap};
  }

  .staged-action-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .stage-items {
    display: flex;
    flex-direction: column;
    gap: ${gap};
    flex: 1;
    min-height: 0;
    height: 100%;
  }

  .stage-item {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: ${gap};
    border: ${t.border.frame};
    border-radius: ${t.border.radius};
    padding: ${gap};
    min-height: 0;
    background: transparent;
  }

  .card-inner--staged-action-dense .stage-item {
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }

  .stage-item-line {
    flex: 1;
    min-width: 0;
    height: 3.5mm;
    align-self: flex-start;
  }

  .card-inner--staged-action-dense .stage-item-line {
    align-self: center;
  }

  .stage-symbols {
    display: flex;
    align-items: center;
    gap: ${gap};
    flex-shrink: 0;
    align-self: flex-start;
  }

  .card-inner--staged-action-dense .stage-symbols {
    align-self: center;
  }

  .stage-symbol {
    width: ${symbol};
    height: ${symbol};
    flex-shrink: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .stage-symbol svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .card-inner--staged-action-dense .stage-symbol {
    width: ${symbolDense};
    height: ${symbolDense};
  }

  .card-inner--staged-action-dense .stage-item-line {
    height: 2.5mm;
  }
`;
}

function projectTrackerStyles(gap) {
  return `
  .tracker-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border: ${t.border.frame};
    border-radius: ${t.border.radius};
    padding: ${gap};
    background: transparent;
  }

  .tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: ${gap};
    margin-bottom: ${gap};
    font-size: ${t.font.label};
    flex-shrink: 0;
  }

  .tracker-field {
    display: flex;
    flex-direction: column;
    gap: 0.5mm;
  }

  .tracker-field--title { flex: 1; min-width: 0; }
  .tracker-field--nbd { width: 22mm; flex-shrink: 0; }

  .tracker-label {
    font-size: ${t.font.date};
    font-weight: bold;
    color: ${t.colors.inkMuted};
    text-transform: uppercase;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  .tracker-field-line {
    border-bottom: ${t.lineWidth} solid ${t.colors.fieldLine};
    height: 3.5mm;
  }

  .tracker-list {
    flex: 1;
    min-height: 0;
  }

  .progress-bar--continuous {
    display: grid;
    grid-template-columns: repeat(${t.progressBar.segments}, 1fr);
    height: ${t.progressBar.height};
    border: ${t.border.card};
    border-radius: ${t.border.radius};
    overflow: hidden;
    flex-shrink: 0;
    margin-top: ${gap};
    background: ${t.colors.cardBg};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .progress-segment {
    border-right: ${t.lineWidth} dotted ${t.colors.cutGuide};
  }

  .progress-segment:last-child { border-right: none; }
`;
}

export function habitTrackerStyles(cols = 20, rows = 31) {
  const L = habitLayout(cols, rows);

  return `
  .date-header {
    position: absolute;
    top: ${DATE_TOP}mm;
    left: ${L.dateHeaderLeft}mm;
    width: ${LABEL_W + L.gridW + LABEL_W}mm;
    height: ${L.dateCell}mm;
    display: flex;
    align-items: stretch;
  }

  .date-label {
    width: ${LABEL_W}mm;
    ${numberCellStyle()}
  }

  .date-row {
    width: ${L.gridW}mm;
    height: ${L.dateCell}mm;
    display: grid;
    grid-template-columns: repeat(${rows}, 1fr);
    border: ${t.border.frame};
    border-radius: ${t.border.radius};
    background: ${t.colors.headerBg};
    overflow: hidden;
  }

  .date-cell {
    border-right: ${t.lineWidth} solid ${t.colors.gridLineLight};
    ${numberCellStyle()}
  }

  .date-cell:last-child { border-right: none; }

  .tracker-block {
    position: absolute;
    top: ${L.gridTop}mm;
    left: ${L.blockLeft}mm;
    width: ${L.blockW}mm;
    height: ${L.gridH + SLANTED_H}mm;
  }

  .habit-grid {
    position: absolute;
    top: 0;
    left: ${SLANT_OFFSET}mm;
    width: ${L.gridW}mm;
    height: ${L.gridH}mm;
    display: grid;
    border: ${t.border.gridStrong};
    border-radius: ${t.border.radius};
    overflow: hidden;
    background: ${t.colors.cardBg};
  }

  .habit-cell {
    border-right: ${t.border.grid};
    border-bottom: ${t.lineWidth} solid ${t.colors.gridLineMid};
  }

  .habit-cell--stripe {
    background: ${t.colors.columnStripe};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .habit-cell:nth-last-child(-n+${cols}) { border-bottom: none; }

  .week-guides {
    position: absolute;
    top: 0;
    left: ${SLANT_OFFSET}mm;
    width: ${L.gridW}mm;
    height: ${L.gridH}mm;
    pointer-events: none;
    z-index: 2;
  }

  .week-guide {
    position: absolute;
    left: 0;
    right: 0;
    border-top: ${t.lineWidth} dotted ${t.colors.cutGuide};
  }

  .slant-footer {
    position: absolute;
    top: ${L.gridH}mm;
    left: 0;
    width: ${L.blockW}mm;
    height: ${SLANTED_H}mm;
    overflow: visible;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .slant-footer svg {
    display: block;
    overflow: visible;
  }
`;
}

export function dateRowWithLabels(days = 31) {
  const cells = Array.from({ length: days }, (_, i) => `<div class="date-cell">${i + 1}</div>`).join("");
  return `<div class="date-header"><div class="date-label">MIN</div><div class="date-row">${cells}</div><div class="date-label">MAX</div></div>`;
}

function habitGridCells(cols, rows) {
  const count = cols * rows;
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const cls = col % 2 === 1 ? "habit-cell habit-cell--stripe" : "habit-cell";
    return `<div class="${cls}"></div>`;
  }).join("");
}

function weekGuideLines(rows) {
  const cell = cellMm();
  const gridH = rows * cell;
  const markers = [7, 14, 21, 28].filter((d) => d < rows);
  return markers
    .map((d) => `<div class="week-guide" style="top:${gridH - d * cell}mm"></div>`)
    .join("");
}

function slantFooterSvg(cols, rows) {
  const L = habitLayout(cols, rows);
  const cellW = L.cell;
  const slantH = SLANTED_H;
  const viewW = L.blockW;
  const stroke = t.colors.ink;
  const sw = t.svgStrokeWidth;

  const stripes = Array.from({ length: cols }, (_, i) => {
    if (i % 2 === 0) return "";
    const x0 = SLANT_OFFSET + i * cellW;
    const x1 = SLANT_OFFSET + (i + 1) * cellW;
    const x0b = x0 - SLANT_OFFSET;
    const x1b = x1 - SLANT_OFFSET;
    const pts = `${x0},0 ${x1},0 ${x1b},${slantH} ${x0b},${slantH}`;
    return `<polygon points="${pts}" fill="${t.colors.columnStripe}"/>`;
  }).join("");

  const dividers = Array.from({ length: cols + 1 }, (_, i) => {
    const xt = (SLANT_OFFSET + i * cellW).toFixed(3);
    const xb = (SLANT_OFFSET + i * cellW - SLANT_OFFSET).toFixed(3);
    return `<line x1="${xt}" y1="0" x2="${xb}" y2="${slantH}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }).join("");

  return `<svg viewBox="0 0 ${viewW} ${slantH}" width="${viewW}mm" height="${slantH}mm">${stripes}${dividers}</svg>`;
}

export function habitTracker(cols, rows) {
  return `<div class="tracker-block">
    <div class="habit-grid" style="grid-template-columns: repeat(${cols}, ${t.cell.size}); grid-template-rows: repeat(${rows}, ${t.cell.size});">${habitGridCells(cols, rows)}</div>
    <div class="week-guides">${weekGuideLines(rows)}</div>
    <div class="slant-footer">${slantFooterSvg(cols, rows)}</div>
  </div>`;
}

export function grid(cols, rows) {
  const cells = habitGridCells(cols, rows);
  return `<div class="habit-grid" style="grid-template-columns: repeat(${cols}, ${t.cell.size}); grid-template-rows: repeat(${rows}, ${t.cell.size});">${cells}</div>`;
}

export function weekGuides(rows = 31) {
  return `<div class="week-guides">${weekGuideLines(rows)}</div>`;
}

export function slantFooter(cols, { gridRows = 31 } = {}) {
  return `<div class="slant-footer">${slantFooterSvg(cols, gridRows)}</div>`;
}

export function slantedLines(count, opts) {
  return slantFooter(count, opts);
}

export function dateRow(days = 31) {
  const cells = Array.from({ length: days }, (_, i) => `<div class="date-cell">${i + 1}</div>`).join("");
  return `<div class="date-row">${cells}</div>`;
}

export function trackerHeaderRow({ titleLabel = "Title", dateLabel = "NBD" } = {}) {
  return `<div class="tracker-header">
    <div class="tracker-field tracker-field--title">
      <span class="tracker-label">${titleLabel}</span>
      <div class="tracker-field-line"></div>
    </div>
    <div class="tracker-field tracker-field--nbd">
      <span class="tracker-label">${dateLabel}</span>
      <div class="tracker-field-line"></div>
    </div>
  </div>`;
}

export function trackerWhyRow() {
  return `<div class="tracker-why">
    <span class="tracker-label">Why</span>
    <div class="tracker-field-line"></div>
  </div>`;
}

export function trackerMilestones(count = 3) {
  const items = Array.from(
    { length: count },
    () => `<div class="tracker-milestone"><div class="tracker-milestone-check"></div><div class="tracker-milestone-line"></div></div>`
  ).join("");
  return `<div class="tracker-milestones">${items}</div>`;
}

export function progressBarContinuous(segments = t.progressBar.segments) {
  const items = Array.from({ length: segments }, () => `<div class="progress-segment"></div>`).join("");
  return `<div class="progress-bar--continuous">${items}</div>`;
}

export function trackerList() {
  return `<div class="tracker-list"></div>`;
}

export function trackerCard() {
  return `<div class="tracker-card">${trackerHeaderRow()}${trackerList()}${progressBarContinuous()}</div>`;
}

export function multiStepTracker(count = 3) {
  const cards = Array.from({ length: count }, () => trackerCard()).join("");
  return `<div class="multi-step-layout">${cards}</div>`;
}

export function goalTracker() {
  const content = `${trackerHeaderRow({ titleLabel: "Goal", dateLabel: "Target" })}${trackerWhyRow()}${trackerMilestones(3)}${trackerList()}${progressBarContinuous()}`;
  return `<div class="goal-layout"><div class="tracker-card">${content}</div></div>`;
}

function stageSymbolSvg(shape) {
  const stroke = t.colors.ink;
  const attrs = `fill="none" stroke="${stroke}" stroke-width="1" vector-effect="non-scaling-stroke"`;
  const shapes = {
    square: `<rect x="1.5" y="1.5" width="9" height="9" ${attrs}/>`,
    triangle: `<polygon points="6,1.5 10.5,10 1.5,10" ${attrs} stroke-linejoin="round"/>`,
    circle: `<circle cx="6" cy="6" r="4.5" ${attrs}/>`,
  };
  return `<svg viewBox="0 0 12 12" aria-hidden="true">${shapes[shape]}</svg>`;
}

export function stageSymbols() {
  return `<div class="stage-symbols">
    <div class="stage-symbol">${stageSymbolSvg("square")}</div>
    <div class="stage-symbol">${stageSymbolSvg("triangle")}</div>
    <div class="stage-symbol">${stageSymbolSvg("circle")}</div>
  </div>`;
}

export function stagedActionItem() {
  return `<div class="stage-item"><div class="stage-item-line"></div>${stageSymbols()}</div>`;
}

export function stagedActionTracker(count = t.stagedAction.itemsRelaxed) {
  const items = Array.from({ length: count }, () => stagedActionItem()).join("");
  return `<div class="staged-action-layout"><div class="stage-items">${items}</div></div>`;
}

function spendSegments(count) {
  const items = Array.from({ length: count }, () => `<div class="spend-segment"></div>`).join("");
  return `<div class="spend-segments">${items}</div>`;
}

export function spendTrackerStyles() {
  const { segments, bucketWidth, marginY } = t.spendTracker;

  return `
  .card-inner--spend {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${marginY};
    padding-bottom: ${marginY};
  }

  .spend-tracker-layout {
    width: ${bucketWidth};
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .spend-bucket {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .spend-segments {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: repeat(${segments}, minmax(0, 1fr));
    border-left: ${t.border.card};
    border-right: ${t.border.card};
    border-bottom: ${t.border.card};
    border-top: none;
    border-radius: 0 0 ${t.border.radius} ${t.border.radius};
    overflow: hidden;
    background: ${t.colors.cardBg};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .spend-segment {
    min-height: 0;
  }

  .spend-segment:not(:first-child) {
    border-top: ${t.lineWidth} dotted ${t.colors.cutGuide};
  }
`;
}

export function spendTracker() {
  const { segments } = t.spendTracker;
  return `<div class="spend-tracker-layout">
    <div class="spend-bucket">${spendSegments(segments)}</div>
  </div>`;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function calendarCell({ day, inMonth }) {
  if (!inMonth) return `<div class="calendar-cell"></div>`;
  return `<div class="calendar-cell calendar-cell--date"><span class="calendar-day">${day}</span></div>`;
}

export function monthlyCalendarStyles() {
  const c = t.calendar;

  return `
  .card-inner--calendar {
    left: 2mm;
    right: 2mm;
    top: 2mm;
    bottom: 2mm;
  }

  .calendar-layout {
    display: flex;
    height: 100%;
    min-height: 0;
    gap: 1.5mm;
  }

  .calendar-sidebar {
    width: ${c.sidebarWidth};
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;
    align-self: stretch;
  }

  .calendar-sidebar-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: ${c.sidebarFont};
    font-weight: bold;
    line-height: 1;
    color: ${t.colors.inkMuted};
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
    text-transform: uppercase;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .calendar-main {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex-shrink: 0;
    padding-bottom: 1mm;
    font-size: ${c.weekdayFont};
    font-weight: bold;
    color: ${t.colors.inkMuted};
    text-align: center;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .calendar-grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(${c.weeks}, minmax(0, 1fr));
  }

  .calendar-cell {
    position: relative;
    min-height: 0;
  }

  .calendar-cell--date {
    border-radius: ${t.border.radius};
    box-shadow: inset 0 0 0 ${c.dateHairline} ${t.colors.calendarDateBorder};
    background: transparent;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .calendar-day {
    position: absolute;
    top: 0.6mm;
    left: 0.6mm;
    font-size: ${c.dayFont};
    font-weight: bold;
    line-height: 1;
    color: ${t.colors.inkMuted};
    font-variant-numeric: tabular-nums;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
}

export function monthlyCalendar(year, month) {
  const monthName = MONTH_NAMES[month - 1];
  const cells = buildCalendarCells(year, month);
  const weekdayRow = WEEKDAYS.map((d) => `<span>${d}</span>`).join("");
  const grid = cells.map((cell) => calendarCell(cell)).join("");

  return `<div class="calendar-layout">
    <div class="calendar-sidebar">
      <span class="calendar-sidebar-label">${monthName} ${year}</span>
    </div>
    <div class="calendar-main">
      <div class="calendar-weekdays">${weekdayRow}</div>
      <div class="calendar-grid">${grid}</div>
    </div>
  </div>`;
}
