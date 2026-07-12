import { tokens as t } from "./tokens.js";

function cardWidthMm() {
  return parseFloat(t.card.width);
}

function centerLeft(contentWidthMm) {
  return `${(cardWidthMm() - contentWidthMm) / 2}mm`;
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

  .date-row {
    position: absolute;
    top: 8mm;
    left: ${centerLeft(31 * 2.375)};
    width: ${31 * 2.375}mm;
    height: ${t.dateCell.size};
    display: grid;
    grid-template-columns: repeat(31, ${t.dateCell.size});
    border: ${t.border.frame};
    border-radius: ${t.border.radius};
    background: ${t.colors.headerBg};
    overflow: hidden;
  }

  .date-cell {
    border-right: ${t.lineWidth} solid ${t.colors.gridLineLight};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${t.font.date};
    font-weight: bold;
    line-height: 1;
    text-align: center;
    font-variant-numeric: tabular-nums;
    color: ${t.colors.inkMuted};
  }

  .date-cell:last-child { border-right: none; }

  .habit-grid {
    position: absolute;
    top: 12mm;
    left: ${centerLeft(20 * 3.8)};
    width: ${20 * 3.8}mm;
    height: ${31 * 3.8}mm;
    display: grid;
    grid-template-columns: repeat(20, ${t.cell.size});
    grid-template-rows: repeat(31, ${t.cell.size});
    border: ${t.border.gridStrong};
    border-radius: ${t.border.radius};
    overflow: hidden;
    background: #fff;
  }

  .habit-cell {
    border-right: ${t.border.grid};
    border-bottom: ${t.lineWidth} solid ${t.colors.gridLineMid};
  }

  .habit-cell:nth-child(20n) { border-right: none; }
  .habit-cell:nth-last-child(-n+20) { border-bottom: none; }

  .slanted-headers {
    position: absolute;
    top: ${12 + 31 * 3.8}mm;
    left: ${centerLeft(20 * 3.8)};
    width: ${20 * 3.8}mm;
    height: 12mm;
    overflow: visible;
  }

  .slanted-headers svg {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
  }
`;
}

export function dateRow(days = 31) {
  const cells = Array.from({ length: days }, (_, i) => `<div class="date-cell">${i + 1}</div>`).join("");
  return `<div class="date-row">${cells}</div>`;
}

export function grid(cols, rows) {
  const count = cols * rows;
  const cells = Array.from({ length: count }, () => `<div class="habit-cell"></div>`).join("");
  return `<div class="habit-grid" style="grid-template-columns: repeat(${cols}, ${t.cell.size}); grid-template-rows: repeat(${rows}, ${t.cell.size}); width: ${cols * 3.8}mm; height: ${rows * 3.8}mm; left: ${centerLeft(cols * 3.8)};">${cells}</div>`;
}

export function slantedLines(count, { gridTop = 12, gridRows = 31 } = {}) {
  const width = count * 3.8;
  const height = 12;
  const cellW = 3.8;
  const angleOffset = 7;
  const yEnd = 12.124;
  const top = gridTop + gridRows * 3.8;

  const lines = Array.from({ length: count + 1 }, (_, i) => {
    const x1 = (i * cellW).toFixed(3);
    const x2 = (i * cellW - angleOffset).toFixed(3);
    return `<line x1="${x1}" y1="0" x2="${x2}" y2="${yEnd}" stroke="${t.colors.ink}" stroke-width="${t.svgStrokeWidth}"/>`;
  }).join("");

  return `<div class="slanted-headers" style="left: ${centerLeft(width)}; width: ${width}mm; top: ${top}mm;">
    <svg viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm" preserveAspectRatio="none">${lines}</svg>
  </div>`;
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
