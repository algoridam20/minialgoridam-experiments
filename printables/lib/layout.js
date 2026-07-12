import { tokens as t } from "./tokens.js";

export function layoutStyles() {
  return `
  @page { size: A4 portrait; margin: 0; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: ${t.colors.screenBg};
    font-family: ${t.font.family};
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
    border-left: 1px dotted ${t.colors.cutGuide};
    pointer-events: none;
    z-index: 10;
  }

  .page::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px dotted ${t.colors.cutGuide};
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
    background-image: radial-gradient(${t.dotGrid.color} ${t.dotGrid.dot}, transparent ${t.dotGrid.dot});
    background-size: ${t.dotGrid.size} ${t.dotGrid.size};
    background-position: ${t.dotGrid.originX} ${t.dotGrid.originY};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .card--tl { top: ${t.sheetMargin.top}; left: ${t.sheetMargin.side}; }
  .card--tr { top: ${t.sheetMargin.top}; right: ${t.sheetMargin.side}; }
  .card--bl { bottom: ${t.sheetMargin.top}; left: ${t.sheetMargin.side}; }
  .card--br { bottom: ${t.sheetMargin.top}; right: ${t.sheetMargin.side}; }

  @media print {
    body { background: none; }
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
