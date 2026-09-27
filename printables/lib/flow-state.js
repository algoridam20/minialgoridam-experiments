import { tokens as t } from "./tokens.js";
import { penroseRhombsForRect } from "./penrose-tiling.js";

/** Perimeter square count for an outerCols × outerRows frame of unit squares. */
export function borderCellCount(outerCols, outerRows) {
  return 2 * outerCols + 2 * outerRows - 4;
}

export function flowStateMetrics(overrides = {}) {
  const base = t.flowState;
  const outerCols = overrides.outerCols ?? base.outerCols;
  const outerRows = overrides.outerRows ?? base.outerRows;
  const borderRings = overrides.borderRings ?? base.borderRings ?? 1;
  const margin = overrides.margin ?? base.margin;
  const sidebarWidth = overrides.sidebarWidth ?? base.sidebarWidth;
  const gap = overrides.gap ?? base.gap;
  const sideGutterRaw = overrides.sideGutter ?? base.sideGutter ?? sidebarWidth;
  const penroseGenerations = overrides.penroseGenerations ?? base.penroseGenerations ?? 4;

  const cardW = parseFloat(t.card.width);
  const cardH = parseFloat(t.card.height);
  const marginN = parseFloat(margin);
  const sideGutter = parseFloat(sideGutterRaw);

  // Equal gutters on all four sides; date strip lives in the left gutter.
  const availW = cardW - 2 * marginN - 2 * sideGutter;
  const availH = cardH - 2 * marginN - 2 * sideGutter;
  const cell = Math.floor(Math.min(availW / outerCols, availH / outerRows) * 100) / 100;
  const width = outerCols * cell;
  const height = outerRows * cell;

  let border = 0;
  for (let ring = 0; ring < borderRings; ring++) {
    const c = outerCols - 2 * ring;
    const r = outerRows - 2 * ring;
    if (c < 2 || r < 2) break;
    border += borderCellCount(c, r);
  }

  const inset = borderRings;

  return {
    outerCols,
    outerRows,
    borderRings,
    penroseGenerations,
    cell,
    width,
    height,
    availW,
    availH,
    border,
    margin,
    sidebarWidth,
    sideGutter: `${sideGutter}mm`,
    gap,
    midX: inset * cell,
    midY: inset * cell,
    midW: (outerCols - 2 * inset) * cell,
    midH: (outerRows - 2 * inset) * cell,
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

function strokeAttrs() {
  const stroke = t.colors.flowStateLine;
  const sw = t.svgStrokeWidth;
  return `fill="none" stroke="${stroke}" stroke-width="${sw}" vector-effect="non-scaling-stroke"`;
}

function diamondPoints(x, y, s) {
  const hx = x + s / 2;
  const hy = y + s / 2;
  return `${hx},${y} ${x + s},${hy} ${hx},${y + s} ${x},${hy}`;
}

function pointsAttr(poly) {
  return poly.map((p) => `${Number(p.x).toFixed(3)},${Number(p.y).toFixed(3)}`).join(" ");
}

function uniqueId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function squareDiamondBorder(m) {
  const attrs = strokeAttrs();
  const s = m.cell;
  const rings = m.borderRings ?? 1;
  const parts = [];
  for (let ring = 0; ring < rings; ring++) {
    const cols = m.outerCols - 2 * ring;
    const rows = m.outerRows - 2 * ring;
    if (cols < 2 || rows < 2) break;
    const ox = ring * s;
    const oy = ring * s;
    for (const { i, j } of borderPositions(cols, rows)) {
      const x = ox + i * s;
      const y = oy + j * s;
      parts.push(
        `<rect x="${x}" y="${y}" width="${s}" height="${s}" ${attrs}/>
    <polygon points="${diamondPoints(x, y, s)}" ${attrs}/>`
      );
    }
  }
  return parts.join("\n");
}

function middlePenroseSvg(m) {
  const attrs = strokeAttrs();
  const pad = m.cell * 0.04;
  const polys = penroseRhombsForRect(m.midX, m.midY, m.midW, m.midH, {
    generations: m.penroseGenerations,
    fillMode: "cover",
    pad,
  });
  return polys.map((poly) => `<polygon points="${pointsAttr(poly)}" ${attrs}/>`).join("\n  ");
}

/** Double square+diamond border with Penrose P3 rhomb middle. */
export function flowStateDeviceSvg(overrides = {}) {
  const m = flowStateMetrics(overrides);
  const attrs = strokeAttrs();
  const clipId = uniqueId("flow-middle");
  const clip = `<rect x="${m.midX}" y="${m.midY}" width="${m.midW}" height="${m.midH}"/>`;
  const frame = `<rect x="0" y="0" width="${m.width}" height="${m.height}" ${attrs}/>`;
  const middleFrame = `<rect x="${m.midX}" y="${m.midY}" width="${m.midW}" height="${m.midH}" ${attrs}/>`;

  return `<svg class="flow-state-svg" viewBox="0 0 ${m.width} ${m.height}" width="${m.width}mm" height="${m.height}mm" aria-hidden="true">
  <defs>
    <clipPath id="${clipId}">${clip}</clipPath>
  </defs>
  ${frame}
  ${squareDiamondBorder(m)}
  ${middleFrame}
  <g clip-path="url(#${clipId})">
  ${middlePenroseSvg(m)}
  </g>
</svg>`;
}

export function flowStateTrackerStyles(overrides = {}) {
  const m = flowStateMetrics(overrides);

  return `
  .card-inner--flow-state {
    left: ${m.margin};
    right: ${m.margin};
    top: ${m.margin};
    bottom: ${m.margin};
  }

  .flow-state-layout {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: 100%;
    min-height: 0;
  }

  .flow-state-sidebar {
    width: ${m.sidebarWidth};
    max-width: 100%;
    box-sizing: border-box;
    padding-right: ${m.gap};
    justify-self: stretch;
    align-self: stretch;
  }

  .flow-state-device {
    grid-column: 2;
    flex-shrink: 0;
    width: ${m.width}mm;
    height: ${m.height}mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .flow-state-svg {
    display: block;
    width: ${m.width}mm;
    height: ${m.height}mm;
    overflow: visible;
  }
`;
}

export function flowStateCardHtml(deviceSvg) {
  return `<div class="flow-state-layout">
    <div class="flow-state-sidebar"></div>
    <div class="flow-state-device">${deviceSvg}</div>
  </div>`;
}

export function flowStateTracker(overrides = {}) {
  return flowStateCardHtml(flowStateDeviceSvg(overrides));
}
