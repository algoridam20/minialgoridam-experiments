import { tokens as t } from "./tokens.js";

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

  .section {
    flex: 1;
    position: relative;
  }

  .section:not(:last-child) {
    border-bottom: ${t.border.divider};
    margin-bottom: 3mm;
    padding-bottom: 3mm;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3mm;
    font-size: ${t.font.label};
  }

  .field {
    border-bottom: ${t.lineWidth} solid ${t.colors.fieldLine};
    height: 4mm;
  }

  .field--title { width: 60%; }
  .field--date { width: 26%; }

  .progress-bar {
    display: flex;
    gap: ${t.progressSquare.gap};
    margin-bottom: 4mm;
  }

  .progress-square {
    width: ${t.progressSquare.size};
    height: ${t.progressSquare.size};
    border: ${t.border.card};
  }

  .write-area {
    position: absolute;
    top: 18mm;
    left: 0;
    right: 0;
    bottom: 0;
  }
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

export function headerRow() {
  return `<div class="header-row"><div class="field field--title"></div><div class="field field--date"></div></div>`;
}

export function progressBar(squares = 8) {
  const items = Array.from({ length: squares }, () => `<div class="progress-square"></div>`).join("");
  return `<div class="progress-bar">${items}</div>`;
}

export function writeArea() {
  return `<div class="write-area"></div>`;
}

export function section(content, { last = false } = {}) {
  const cls = last ? "section section--last" : "section";
  const style = last ? ' style="border-bottom:none;padding-bottom:0;margin-bottom:0;"' : "";
  return `<div class="${cls}"${style}>${content}</div>`;
}

export function multiStepSection(last = false) {
  return section(`${headerRow()}${progressBar(8)}${writeArea()}`, { last });
}
