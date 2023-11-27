function y(t, e, r) {
  return e * r + t;
}
function l(t, e) {
  return { x: t % e, y: Math.floor(t / e), z: 0 };
}
const h = Math.atan(0.5), x = Math.PI / 6, g = Math.PI / 4, S = { x: 0, y: 0 }, v = { x: 0.5, y: 0.5 }, M = { x: 1, y: 1 };
var a = /* @__PURE__ */ ((t) => (t.NONE = "NONE", t.N = "N", t.NE = "NE", t.E = "E", t.SE = "SE", t.S = "S", t.SW = "SW", t.W = "W", t.NW = "NW", t))(a || {});
function W(t) {
  const e = [];
  for (const r of Array.from(t.keys()).sort()) {
    const n = t.get(r);
    for (const f of Array.from(n.keys()).sort()) {
      const u = n.get(f);
      for (const s of Array.from(u.keys()).sort())
        e.push(u.get(s));
    }
  }
  return e;
}
function E(t, e, r) {
  let n = t;
  for (; e.length - 1; ) {
    var f = e.shift();
    let u = n.get(f);
    if (u === void 0) {
      const s = /* @__PURE__ */ new Map();
      n.set(f, s), n = s;
    } else
      n = u;
  }
  return n.set(e[0], r), r;
}
function i(t, e, r) {
  for (var n = t; e.length; ) {
    var f = e.shift();
    let u = n.get(f);
    if (u === void 0) {
      if (r && !e.length)
        return n.set(f, r), r;
      if (r)
        u = /* @__PURE__ */ new Map(), n.set(f, u);
      else
        return;
    }
    n = u;
  }
  return n;
}
function L(t, e) {
  return i(t, [e.z || 0, e.x, e.y]);
}
function A(t, e) {
  let r = t;
  for (; e.length - 1; ) {
    var n = e.shift();
    let f = r.get(n);
    if (f === void 0)
      return !1;
    r = f;
  }
  return r.delete(e[0]);
}
function P(t, e) {
  return Math.sqrt(
    (e.x - t.x) * (e.x - t.x) + (e.y - t.y) * (e.y - t.y)
  );
}
function d(t) {
  return {
    x: c(t.map((e) => e.x)) / t.length,
    y: c(t.map((e) => e.y)) / t.length
  };
}
function c(t) {
  return t.reduce((e, r) => r ? e + r : e, 0);
}
const o = 0;
function m(t, e) {
  let r = e.x - t.x, n = e.y - t.y;
  return r === o && n < o ? "N" : r > o && n < o ? "NE" : r > o && n === o ? "E" : r > o && n > o ? "SE" : r === o && n > o ? "S" : r < o && n > o ? "SW" : r < o && n === o ? "W" : r < o && n < o ? "NW" : "NONE";
}
export {
  h as CLASSIC,
  a as DIRECTION,
  M as FULL,
  x as ISOMETRIC,
  v as MIDDLE,
  g as MILITARY,
  S as TOP_LEFT,
  W as collectRay,
  y as coordsToIndex,
  i as get,
  d as getCenter,
  m as getDirection,
  P as getDistance,
  l as indexToCoords,
  L as pointGet,
  A as remove,
  E as set,
  c as sum
};
