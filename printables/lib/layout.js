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

  .page::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    border-left: ${t.lineWidth} dotted ${t.colors.cutGuide};
    pointer-events: none;
    z-index: 10;
  }

  .page::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: ${t.lineWidth} dotted ${t.colors.cutGuide};
    pointer-events: none;
    z-index: 10;
  }

  .card {
    width: ${t.card.width};
    height: ${t.card.height};
    border: ${t.border.card};
    border-radius: ${t.border.radius};
    position: absolute;
    overflow: hidden;
    background-color: ${t.colors.cardBg};
    background-image: radial-gradient(${t.dotGrid.color} ${t.dotGrid.dot}, ${t.colors.cardBg} ${t.dotGrid.dot});
    background-size: ${t.dotGrid.size} ${t.dotGrid.size};
    background-position: ${t.dotGrid.originX} ${t.dotGrid.originY};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .card--tl { top: ${t.sheetMargin.y}; left: ${t.sheetMargin.x}; }
  .card--tr { top: ${t.sheetMargin.y}; right: ${t.sheetMargin.x}; }
  .card--bl { bottom: ${t.sheetMargin.y}; left: ${t.sheetMargin.x}; }
  .card--br { bottom: ${t.sheetMargin.y}; right: ${t.sheetMargin.x}; }

  @media print {
    html, body { background: white !important; }
  }
`;
}

const POSITIONS = ["tl", "tr", "bl", "br"];

export function a4sheet(cardInnerHtml) {
  return POSITIONS.map((pos) => `<div class="card card--${pos}">${cardInnerHtml}</div>`).join("\n");
}

export function cardInner(content, { flex = false } = {}) {
  const cls = flex ? "card-inner card-inner--flex" : "card-inner";
  return `<div class="${cls}">${content}</div>`;
}
