import { tokens as t } from "./tokens.js";
import { hatPolygonsForRect } from "./hat-tiling.js";

/** Perimeter square count for an outerCols × outerRows frame of unit squares. */
export function borderCellCount(outerCols, outerRows) {
  return 2 * outerCols + 2 * outerRows - 4;
}

export function flowStateMetrics() {
  const { outerCols, outerRows, margin, sidebarWidth, gap } = t.flowState;
  const cardW = parseFloat(t.card.width);
  const cardH = parseFloat(t.card.height);
  const marginN = parseFloat(margin);
  const sidebarN = parseFloat(sidebarWidth);
  const gapN = parseFloat(gap);

  // Blank strip only on the left; device uses remaining width + full height.
  const availW = cardW - 2 * marginN - sidebarN - gapN;
  const availH = cardH - 2 * marginN;
  const cell = Math.floor(Math.min(availW / outerCols, availH / outerRows) * 100) / 100;
  const width = outerCols * cell;
  const height = outerRows * cell;

  return {
    outerCols,
    outerRows,
    cell,
    width,
    height,
    availW,
    availH,
    border: borderCellCount(outerCols, outerRows),
    margin,
    sidebarWidth,
    gap,
  };
}

function borderPositions(outerCols, outerRows) {
  const positions = [];
  for (let i = 0; i < outerCols; i++) {
    positions.push({ i, j: 0 });
    positions.push({ i, j: outerRows - 1 });
  }
  for (let j = 1; j < outerRows - 1; j++) {
    positions.push({ i: 0, j });
    positions.push({ i: outerCols - 1, j });
  }
  return positions;
}

function diamondPoints(x, y, s) {
  const hx = x + s / 2;
  const hy = y + s / 2;
  return `${hx},${y} ${x + s},${hy} ${hx},${y + s} ${x},${hy}`;
}

function pointsAttr(poly) {
  return poly.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(" ");
}

export function flowStateDeviceSvg() {
  const m = flowStateMetrics();
  const { outerCols, outerRows, cell: s, width, height, border } = m;
  const stroke = t.colors.flowStateLine;
  const sw = t.svgStrokeWidth;
  const attrs = `fill="none" stroke="${stroke}" stroke-width="${sw}" vector-effect="non-scaling-stroke"`;

  const cells = borderPositions(outerCols, outerRows)
    .map(({ i, j }) => {
      const x = i * s;
      const y = j * s;
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" ${attrs}/>
    <polygon points="${diamondPoints(x, y, s)}" ${attrs}/>`;
    })
    .join("\n");

  const midX = s;
  const midY = s;
  const midW = (outerCols - 2) * s;
  const midH = (outerRows - 2) * s;
  const pad = s * 0.06;
  const hats = hatPolygonsForRect(border, midX, midY, midW, midH, pad);
  const hatPolys = hats
    .map((poly) => `<polygon points="${pointsAttr(poly)}" ${attrs}/>`)
    .join("\n  ");

  const clipId = `flow-middle-${Math.random().toString(36).slice(2, 9)}`;
  const frame = `<rect x="0" y="0" width="${width}" height="${height}" ${attrs}/>`;
  const middleFrame = `<rect x="${midX}" y="${midY}" width="${midW}" height="${midH}" ${attrs}/>`;

  return `<svg class="flow-state-svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm" aria-hidden="true">
  <defs>
    <clipPath id="${clipId}"><rect x="${midX}" y="${midY}" width="${midW}" height="${midH}"/></clipPath>
  </defs>
  ${frame}
  ${cells}
  ${middleFrame}
  <g clip-path="url(#${clipId})">
  ${hatPolys}
  </g>
</svg>`;
}
