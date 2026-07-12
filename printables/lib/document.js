import { layoutStyles } from "./layout.js";

export function printablePage({ title, extraStyles = "", body }) {
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
<body>
<div class="page">
${body}
</div>
</body>
</html>
`;
}
