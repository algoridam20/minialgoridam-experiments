import { layoutStyles } from "./layout.js";

export function printableDocument({ title, extraStyles = "", pages }) {
  const multi = pages.length > 1;
  const bodyClass = multi ? ' class="pages"' : "";

  return `<!DOCTYPE html>
<!-- GENERATED — do not edit. Source: printables/ -->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
${layoutStyles()}
${extraStyles}
</style>
</head>
<body${bodyClass}>
${pages.map((page) => `<div class="page">\n${page}\n</div>`).join("\n")}
</body>
</html>
`;
}

export function printablePage({ title, extraStyles = "", body }) {
  return printableDocument({ title, extraStyles, pages: [body] });
}
