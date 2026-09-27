/**
 * Penrose P3 (thick/thin rhomb) via Robinson-triangle subdivision.
 * Algorithm after Jeff Preshing:
 * https://preshing.com/20110831/penrose-tiling-explained/
 *
 * Starts from a 10-triangle "sun/wheel", subdivides by the golden ratio,
 * then pairs half-tiles across shared bases into closed rhombs.
 */

const PHI = (1 + Math.sqrt(5)) / 2;

function pt(z) {
  return { x: z.re, y: z.im };
}

function c(re, im = 0) {
  return { re, im };
}

function cadd(a, b) {
  return c(a.re + b.re, a.im + b.im);
}

function csub(a, b) {
  return c(a.re - b.re, a.im - b.im);
}

function cscale(a, s) {
  return c(a.re * s, a.im * s);
}

function cdiv(a, s) {
  return c(a.re / s, a.im / s);
}

/** Polar → complex (radius, radians). */
function crect(r, theta) {
  return c(r * Math.cos(theta), r * Math.sin(theta));
}

function roundKey(v) {
  return Math.round(v * 1e6);
}

function edgeKey(B, C) {
  const b = `${roundKey(B.re)},${roundKey(B.im)}`;
  const c_ = `${roundKey(C.re)},${roundKey(C.im)}`;
  return b < c_ ? `${b}|${c_}` : `${c_}|${b}`;
}

/**
 * Subdivide red (0, acute) and blue (1, obtuse) Robinson triangles.
 * Each tuple: [color, A, B, C] as complex points.
 */
export function subdivide(triangles) {
  const result = [];
  for (const [color, A, B, C] of triangles) {
    if (color === 0) {
      const P = cadd(A, cdiv(csub(B, A), PHI));
      result.push([0, C, P, B], [1, P, C, A]);
    } else {
      const Q = cadd(B, cdiv(csub(A, B), PHI));
      const R = cadd(B, cdiv(csub(C, B), PHI));
      result.push([1, R, C, A], [1, Q, R, B], [0, R, Q, A]);
    }
  }
  return result;
}

/** Ten red triangles around the origin (classic sun/wheel seed). */
export function sunWheel(radius = 1) {
  const triangles = [];
  for (let i = 0; i < 10; i++) {
    let B = crect(radius, ((2 * i - 1) * Math.PI) / 10);
    let C = crect(radius, ((2 * i + 1) * Math.PI) / 10);
    if (i % 2 === 0) {
      const tmp = B;
      B = C;
      C = tmp;
    }
    triangles.push([0, c(0, 0), B, C]);
  }
  return triangles;
}

export function generateTriangles(generations = 5, radius = 1) {
  let triangles = sunWheel(radius);
  for (let g = 0; g < generations; g++) {
    triangles = subdivide(triangles);
  }
  return triangles;
}

/**
 * Pair half-tiles that share a base BC into closed thick/thin rhombs.
 * Unpaired boundary halves are emitted as triangles.
 */
export function trianglesToRhombs(triangles) {
  const byBase = new Map();
  for (const [color, A, B, C] of triangles) {
    const key = edgeKey(B, C);
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key).push({ color, A, B, C });
  }

  const polys = [];
  for (const group of byBase.values()) {
    if (group.length >= 2) {
      const [t1, t2] = group;
      // Rhomb: A₁ → B → A₂ → C
      polys.push([pt(t1.A), pt(t1.B), pt(t2.A), pt(t1.C)]);
    } else {
      const t = group[0];
      polys.push([pt(t.A), pt(t.B), pt(t.C)]);
    }
  }
  return polys;
}

function boundsOf(polys) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const poly of polys) {
    for (const p of poly) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

/**
 * Fit Penrose rhombs into a target rectangle (cover or contain).
 * Returns polygons in target coordinates.
 */
export function penroseRhombsForRect(
  x,
  y,
  w,
  h,
  { generations = 4, fillMode = "cover", pad = 0 } = {}
) {
  const polys = trianglesToRhombs(generateTriangles(generations));
  const b = boundsOf(polys);
  if (b.w <= 0 || b.h <= 0) return [];

  const availW = Math.max(0, w - 2 * pad);
  const availH = Math.max(0, h - 2 * pad);
  const sx = availW / b.w;
  const sy = availH / b.h;
  const scale = fillMode === "contain" ? Math.min(sx, sy) : Math.max(sx, sy);
  const ox = x + pad + (availW - b.w * scale) / 2;
  const oy = y + pad + (availH - b.h * scale) / 2;

  return polys.map((poly) =>
    poly.map((p) => ({
      x: ox + (p.x - b.minX) * scale,
      y: oy + (p.y - b.minY) * scale,
    }))
  );
}
