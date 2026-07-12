const line = "1px solid";

export const tokens = {
  paper: { width: "210mm", height: "297mm" },
  quadrant: { width: "105mm", height: "148.5mm" },
  card: { width: "102mm", height: "145mm" },
  lineWidth: "1px",
  svgStrokeWidth: "0.35",
  // Centered in each quadrant: (quadrant − card) / 2
  sheetMargin: { x: "1.5mm", y: "1.75mm" },
  cutGap: "1.5mm",
  padding: { x: "8mm", y: "7mm" },
  dotGrid: {
    size: "3.8mm",
    dot: "0.55px",
    color: "#d8d8d8",
    originX: "8mm",
    originY: "7mm",
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
    fieldLine: "#444",
    cutGuide: "#888",
    screenBg: "#ececec",
  },
  cell: { size: "3.8mm" },
  dateCell: { size: "2.375mm" },
  progressSquare: { size: "5mm", gap: "1.2mm" },
  font: {
    family: "Arial, sans-serif",
    label: "8pt",
    date: "3pt",
  },
};
