import { tokens as t } from "./tokens.js";

export function layoutStyles() {
  return `
  @page { size: A4 portrait; margin: 0; background: white; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    background: white;
    font-family: ${t.font.family};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  @media screen {
    body { background: ${t.colors.screenBg}; }
  }

  .page {
    width: ${t.paper.width};
    height: ${t.paper.height};
    background: white;
    position: relative;
  }

  .card {
    width: ${t.card.width};
    height: ${t.card.height};
    border: ${t.border.card};
    border-radius: ${t.border.radius};
    position: absolute;
    overflow: visible;
    background-color: ${t.colors.cardBg};
    background-image: radial-gradient(${t.dotGrid.color} ${t.dotGrid.dot}, ${t.colors.cardBg} ${t.dotGrid.dot});
    background-size: ${t.dotGrid.size} ${t.dotGrid.size};
    background-position: ${t.dotGrid.originX} ${t.dotGrid.originY};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .card::before {
    content: "";
    position: absolute;
    top: -${t.cardCutOutline};
    left: -${t.cardCutOutline};
    right: -${t.cardCutOutline};
    bottom: -${t.cardCutOutline};
    border: ${t.lineWidth} dotted ${t.colors.cutGuide};
    border-radius: ${t.border.radius};
    pointer-events: none;
    z-index: 5;
  }

  .card--tl { top: ${t.sheetMargin.y}; left: ${t.sheetMargin.x}; }
  .card--tr { top: ${t.sheetMargin.y}; right: ${t.sheetMargin.x}; }
  .card--bl { bottom: ${t.sheetMargin.y}; left: ${t.sheetMargin.x}; }
  .card--br { bottom: ${t.sheetMargin.y}; right: ${t.sheetMargin.x}; }

  @media print {
    html, body { background: white !important; }
  }

  body.pages {
    flex-direction: column;
    align-items: center;
    gap: 12mm;
    padding: 12mm 0;
  }

  @media print {
    body.pages {
      gap: 0;
      padding: 0;
    }
  }

  .page + .page {
    break-before: page;
    page-break-before: always;
  }
`;
}

const POSITIONS = ["tl", "tr", "bl", "br"];

export function a4sheet(cardInnerHtml) {
  return POSITIONS.map((pos) => `<div class="card card--${pos}">${cardInnerHtml}</div>`).join("\n");
}

export function a4sheetVariants(cardsByPosition) {
  return POSITIONS.map((pos) => `<div class="card card--${pos}">${cardsByPosition[pos]}</div>`).join("\n");
}

export function cardInner(content, { flex = false, className = "" } = {}) {
  const cls = ["card-inner", flex && "card-inner--flex", className].filter(Boolean).join(" ");
  return `<div class="${cls}">${content}</div>`;
}
