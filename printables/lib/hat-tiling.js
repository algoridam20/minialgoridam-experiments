/**
 * Hat (Einstein) aperiodic monotile geometry + substitution.
 * Adapted from Craig S. Kaplan's hatviz (BSD-3-Clause):
 * https://github.com/isohedral/hatviz
 *
 * Copyright (c) 2023, Craig S. Kaplan
 * See that repository's LICENSE for the full license text.
 */

const hr3 = Math.sqrt(3) / 2;
const ident = [1, 0, 0, 0, 1, 0];

function pt(x, y) {
  return { x, y };
}

function hexPt(x, y) {
  return pt(x + 0.5 * y, hr3 * y);
}

function inv(T) {
  const det = T[0] * T[4] - T[1] * T[3];
  return [
    T[4] / det,
    -T[1] / det,
    (T[1] * T[5] - T[2] * T[4]) / det,
    -T[3] / det,
    T[0] / det,
    (T[2] * T[3] - T[0] * T[5]) / det,
  ];
}

function mul(A, B) {
  return [
    A[0] * B[0] + A[1] * B[3],
    A[0] * B[1] + A[1] * B[4],
    A[0] * B[2] + A[1] * B[5] + A[2],
    A[3] * B[0] + A[4] * B[3],
    A[3] * B[1] + A[4] * B[4],
    A[3] * B[2] + A[4] * B[5] + A[5],
  ];
}

function padd(p, q) {
  return pt(p.x + q.x, p.y + q.y);
}

function psub(p, q) {
  return pt(p.x - q.x, p.y - q.y);
}

function trot(ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return [c, -s, 0, s, c, 0];
}

function ttrans(tx, ty) {
  return [1, 0, tx, 0, 1, ty];
}

function rotAbout(p, ang) {
  return mul(ttrans(p.x, p.y), mul(trot(ang), ttrans(-p.x, -p.y)));
}

function transPt(M, P) {
  return pt(M[0] * P.x + M[1] * P.y + M[2], M[3] * P.x + M[4] * P.y + M[5]);
}

function matchSeg(p, q) {
  return [q.x - p.x, p.y - q.y, p.x, q.y - p.y, q.x - p.x, p.y];
}

function matchTwo(p1, q1, p2, q2) {
  return mul(matchSeg(p2, q2), inv(matchSeg(p1, q1)));
}

function intersect(p1, q1, p2, q2) {
  const d = (q2.y - p2.y) * (q1.x - p1.x) - (q2.x - p2.x) * (q1.y - p1.y);
  const uA = ((q2.x - p2.x) * (p1.y - p2.y) - (q2.y - p2.y) * (p1.x - p2.x)) / d;
  return pt(p1.x + uA * (q1.x - p1.x), p1.y + uA * (q1.y - p1.y));
}

const hat_outline = [
  hexPt(0, 0),
  hexPt(-1, -1),
  hexPt(0, -2),
  hexPt(2, -2),
  hexPt(2, -1),
  hexPt(4, -2),
  hexPt(5, -1),
  hexPt(4, 0),
  hexPt(3, 0),
  hexPt(2, 2),
  hexPt(0, 3),
  hexPt(0, 2),
  hexPt(-1, 2),
];

class HatTile {
  constructor(label) {
    this.label = label;
    this.shape = hat_outline;
    this.children = null;
  }
}

class MetaTile {
  constructor(shape, width) {
    this.shape = shape;
    this.width = width;
    this.children = [];
  }

  addChild(T, geom) {
    this.children.push({ T, geom });
  }

  evalChild(n, i) {
    return transPt(this.children[n].T, this.children[n].geom.shape[i]);
  }

  recentre() {
    let cx = 0;
    let cy = 0;
    for (const p of this.shape) {
      cx += p.x;
      cy += p.y;
    }
    cx /= this.shape.length;
    cy /= this.shape.length;
    const tr = pt(-cx, -cy);
    for (let idx = 0; idx < this.shape.length; ++idx) {
      this.shape[idx] = padd(this.shape[idx], tr);
    }
    const M = ttrans(-cx, -cy);
    for (const ch of this.children) {
      ch.T = mul(M, ch.T);
    }
  }
}

const H1_hat = new HatTile("H1");
const H_hat = new HatTile("H");
const T_hat = new HatTile("T");
const P_hat = new HatTile("P");
const F_hat = new HatTile("F");

function buildHInit() {
  const H_outline = [
    pt(0, 0),
    pt(4, 0),
    pt(4.5, hr3),
    pt(2.5, 5 * hr3),
    pt(1.5, 5 * hr3),
    pt(-0.5, hr3),
  ];
  const meta = new MetaTile(H_outline, 2);
  meta.addChild(matchTwo(hat_outline[5], hat_outline[7], H_outline[5], H_outline[0]), H_hat);
  meta.addChild(matchTwo(hat_outline[9], hat_outline[11], H_outline[1], H_outline[2]), H_hat);
  meta.addChild(matchTwo(hat_outline[5], hat_outline[7], H_outline[3], H_outline[4]), H_hat);
  meta.addChild(
    mul(ttrans(2.5, hr3), mul([-0.5, -hr3, 0, hr3, -0.5, 0], [0.5, 0, 0, 0, -0.5, 0])),
    H1_hat
  );
  return meta;
}

function buildTInit() {
  const T_outline = [pt(0, 0), pt(3, 0), pt(1.5, 3 * hr3)];
  const meta = new MetaTile(T_outline, 2);
  meta.addChild([0.5, 0, 0.5, 0, 0.5, hr3], T_hat);
  return meta;
}

function buildPInit() {
  const P_outline = [pt(0, 0), pt(4, 0), pt(3, 2 * hr3), pt(-1, 2 * hr3)];
  const meta = new MetaTile(P_outline, 2);
  meta.addChild([0.5, 0, 1.5, 0, 0.5, hr3], P_hat);
  meta.addChild(
    mul(ttrans(0, 2 * hr3), mul([0.5, hr3, 0, -hr3, 0.5, 0], [0.5, 0, 0, 0, 0.5, 0])),
    P_hat
  );
  return meta;
}

function buildFInit() {
  const F_outline = [pt(0, 0), pt(3, 0), pt(3.5, hr3), pt(3, 2 * hr3), pt(-1, 2 * hr3)];
  const meta = new MetaTile(F_outline, 2);
  meta.addChild([0.5, 0, 1.5, 0, 0.5, hr3], F_hat);
  meta.addChild(
    mul(ttrans(0, 2 * hr3), mul([0.5, hr3, 0, -hr3, 0.5, 0], [0.5, 0, 0, 0, 0.5, 0])),
    F_hat
  );
  return meta;
}

function constructPatch(H, T, P, F) {
  const rules = [
    ["H"],
    [0, 0, "P", 2],
    [1, 0, "H", 2],
    [2, 0, "P", 2],
    [3, 0, "H", 2],
    [4, 4, "P", 2],
    [0, 4, "F", 3],
    [2, 4, "F", 3],
    [4, 1, 3, 2, "F", 0],
    [8, 3, "H", 0],
    [9, 2, "P", 0],
    [10, 2, "H", 0],
    [11, 4, "P", 2],
    [12, 0, "H", 2],
    [13, 0, "F", 3],
    [14, 2, "F", 1],
    [15, 3, "H", 4],
    [8, 2, "F", 1],
    [17, 3, "H", 0],
    [18, 2, "P", 0],
    [19, 2, "H", 2],
    [20, 4, "F", 3],
    [20, 0, "P", 2],
    [22, 0, "H", 2],
    [23, 4, "F", 3],
    [23, 0, "F", 3],
    [16, 0, "P", 2],
    [9, 4, 0, 2, "T", 2],
    [4, 0, "F", 3],
  ];

  const ret = new MetaTile([], H.width);
  const shapes = { H, T, P, F };

  for (const r of rules) {
    if (r.length === 1) {
      ret.addChild(ident, shapes[r[0]]);
    } else if (r.length === 4) {
      const poly = ret.children[r[0]].geom.shape;
      const Tm = ret.children[r[0]].T;
      const Ppt = transPt(Tm, poly[(r[1] + 1) % poly.length]);
      const Qpt = transPt(Tm, poly[r[1]]);
      const nshp = shapes[r[2]];
      const npoly = nshp.shape;
      ret.addChild(matchTwo(npoly[r[3]], npoly[(r[3] + 1) % npoly.length], Ppt, Qpt), nshp);
    } else {
      const chP = ret.children[r[0]];
      const chQ = ret.children[r[2]];
      const Ppt = transPt(chQ.T, chQ.geom.shape[r[3]]);
      const Qpt = transPt(chP.T, chP.geom.shape[r[1]]);
      const nshp = shapes[r[4]];
      const npoly = nshp.shape;
      ret.addChild(matchTwo(npoly[r[5]], npoly[(r[5] + 1) % npoly.length], Ppt, Qpt), nshp);
    }
  }

  return ret;
}

function constructMetatiles(patch) {
  const bps1 = patch.evalChild(8, 2);
  const bps2 = patch.evalChild(21, 2);
  const rbps = transPt(rotAbout(bps1, (-2.0 * Math.PI) / 3.0), bps2);

  const p72 = patch.evalChild(7, 2);
  const p252 = patch.evalChild(25, 2);

  const llc = intersect(bps1, rbps, patch.evalChild(6, 2), p72);
  let w = psub(patch.evalChild(6, 2), llc);

  const new_H_outline = [llc, bps1];
  w = transPt(trot(-Math.PI / 3), w);
  new_H_outline.push(padd(new_H_outline[1], w));
  new_H_outline.push(patch.evalChild(14, 2));
  w = transPt(trot(-Math.PI / 3), w);
  new_H_outline.push(psub(new_H_outline[3], w));
  new_H_outline.push(patch.evalChild(6, 2));

  const new_H = new MetaTile(new_H_outline, patch.width * 2);
  for (const ch of [0, 9, 16, 27, 26, 6, 1, 8, 10, 15]) {
    new_H.addChild(patch.children[ch].T, patch.children[ch].geom);
  }

  const new_P_outline = [p72, padd(p72, psub(bps1, llc)), bps1, llc];
  const new_P = new MetaTile(new_P_outline, patch.width * 2);
  for (const ch of [7, 2, 3, 4, 28]) {
    new_P.addChild(patch.children[ch].T, patch.children[ch].geom);
  }

  const new_F_outline = [
    bps2,
    patch.evalChild(24, 2),
    patch.evalChild(25, 0),
    p252,
    padd(p252, psub(llc, bps1)),
  ];
  const new_F = new MetaTile(new_F_outline, patch.width * 2);
  for (const ch of [21, 20, 22, 23, 24, 25]) {
    new_F.addChild(patch.children[ch].T, patch.children[ch].geom);
  }

  const AAA = new_H_outline[2];
  const BBB = padd(new_H_outline[1], psub(new_H_outline[4], new_H_outline[5]));
  const CCC = transPt(rotAbout(BBB, -Math.PI / 3), AAA);
  const new_T_outline = [BBB, CCC, AAA];
  const new_T = new MetaTile(new_T_outline, patch.width * 2);
  new_T.addChild(patch.children[11].T, patch.children[11].geom);

  new_H.recentre();
  new_P.recentre();
  new_F.recentre();
  new_T.recentre();

  return [new_H, new_T, new_P, new_F];
}

function collectHats(geom, T, out) {
  if (!geom.children) {
    out.push(hat_outline.map((p) => transPt(T, p)));
    return;
  }
  for (const ch of geom.children) {
    collectHats(ch.geom, mul(T, ch.T), out);
  }
}

function boundsOf(polygons) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const poly of polygons) {
    for (const p of poly) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function centroid(poly) {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return pt(x / poly.length, y / poly.length);
}

/**
 * Build a non-overlapping hat patch via Kaplan substitution, then
 * return exactly `count` hats fitted into the target rectangle.
 */
export function hatPolygonsForRect(count, x0, y0, w, h, pad = 0) {
  let tiles = [buildHInit(), buildTInit(), buildPInit(), buildFInit()];
  let hats = [];
  collectHats(tiles[0], ident, hats);

  // Inflate until we have enough hats (H metatile grows quickly).
  while (hats.length < count) {
    const patch = constructPatch(...tiles);
    tiles = constructMetatiles(patch);
    hats = [];
    collectHats(tiles[0], ident, hats);
  }

  const cx = hats.reduce((s, poly) => s + centroid(poly).x, 0) / hats.length;
  const cy = hats.reduce((s, poly) => s + centroid(poly).y, 0) / hats.length;

  const selected = hats
    .map((poly) => {
      const c = centroid(poly);
      const dx = c.x - cx;
      const dy = c.y - cy;
      return { poly, dist: dx * dx + dy * dy };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map((x) => x.poly);

  const b = boundsOf(selected);
  const fitW = w - 2 * pad;
  const fitH = h - 2 * pad;
  const scale = Math.min(fitW / b.w, fitH / b.h);
  const ox = x0 + pad + (fitW - b.w * scale) / 2 - b.minX * scale;
  const oy = y0 + pad + (fitH - b.h * scale) / 2 - b.minY * scale;

  return selected.map((poly) =>
    poly.map((p) => ({
      x: ox + p.x * scale,
      y: oy + p.y * scale,
    }))
  );
}

export { hat_outline };
