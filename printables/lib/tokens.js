const line = "1px solid";

const quadrantW = 105;
const quadrantH = 148.5;
const cardW = 90;
const cardH = 145;

export const tokens = {
  paper: { width: "210mm", height: "297mm" },
  quadrant: { width: "105mm", height: "148.5mm" },
  card: { width: `${cardW}mm`, height: `${cardH}mm` },
  lineWidth: "1px",
  svgStrokeWidth: "0.35",
  sheetMargin: {
    x: `${(quadrantW - cardW) / 2}mm`,
    y: `${(quadrantH - cardH) / 2}mm`,
  },
  cutGap: `${(quadrantW - cardW) / 2}mm`,
  cardCutOutline: "2mm",
  padding: { x: "5mm", y: "3mm" },
  multiStep: { gap: "2mm" },
  stagedAction: { itemsRelaxed: 8, itemsDense: 16, symbolSize: "3mm", symbolSizeDense: "2.5mm" },
  spendTracker: { segments: 30, bucketWidth: "70%", marginY: "10mm" },
  dotGrid: {
    size: "3.8mm",
    dot: "0.55px",
    color: "#d8d8d8",
    originX: "3.5mm",
    originY: "3mm",
  },
  border: {
    card: `${line} #111`,
    frame: `${line} #111`,
    grid: `${line} #e0e0e0`,
    gridStrong: `${line} #111`,
    divider: `${line} #333`,
    radius: "0.5mm",
  },
  colors: {
    ink: "#111",
    inkMuted: "#333",
    gridLine: "#e0e0e0",
    gridLineMid: "#ccc",
    gridLineLight: "#b0b0b0",
    headerBg: "#fafafa",
    columnStripe: "#f5f5f5",
    fieldLine: "#444",
    cutGuide: "#888",
    screenBg: "#ececec",
    cardBg: "#fff",
  },
  cell: { size: "3.8mm" },
  dateCell: { size: "2.45" },
  progressSquare: { size: "5mm", gap: "1.2mm" },
  progressBar: { height: "4mm", segments: 8 },
  font: {
    family: "Arial, sans-serif",
    label: "8pt",
    date: "3pt",
  },
};
