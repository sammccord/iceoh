var v = Object.defineProperty;
var M = (r, i, e) => i in r ? v(r, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[i] = e;
var l = (r, i, e) => (M(r, typeof i != "symbol" ? i + "" : i, e), e);
const O = Math.atan(0.5), C = Math.PI / 6, L = Math.PI / 4, W = { x: 0, y: 0 }, T = { x: 0.5, y: 0.5 }, _ = { x: 1, y: 1 };
var H = /* @__PURE__ */ ((r) => (r.NONE = "NONE", r.N = "N", r.NE = "NE", r.E = "E", r.SE = "SE", r.S = "S", r.SW = "SW", r.W = "W", r.NW = "NW", r))(H || {});
function k(r) {
  const i = [];
  for (const e of Array.from(r.keys()).sort()) {
    const s = r.get(e);
    for (const t of Array.from(s.keys()).sort()) {
      const n = s.get(t);
      for (const h of Array.from(n.keys()).sort())
        i.push(n.get(h));
    }
  }
  return i;
}
function g(r, i, e) {
  let s = r;
  for (; i.length - 1; ) {
    var t = i.shift();
    let n = s.get(t);
    if (n === void 0) {
      const h = /* @__PURE__ */ new Map();
      s.set(t, h), s = h;
    } else
      s = n;
  }
  return s.set(i[0], e), e;
}
function w(r, i, e) {
  for (var s = r; i.length; ) {
    var t = i.shift();
    let n = s.get(t);
    if (n === void 0) {
      if (e && !i.length)
        return s.set(t, e), e;
      if (e)
        n = /* @__PURE__ */ new Map(), s.set(t, n);
      else
        return;
    }
    s = n;
  }
  return s;
}
function A(r, i) {
  return w(r, [i.z || 0, i.x, i.y]);
}
function z(r, i) {
  let e = r;
  for (; i.length - 1; ) {
    var s = i.shift();
    let t = e.get(s);
    if (t === void 0)
      return !1;
    e = t;
  }
  return e.delete(i[0]);
}
function N(r, i) {
  return Math.sqrt(
    (i.x - r.x) * (i.x - r.x) + (i.y - r.y) * (i.y - r.y)
  );
}
function j(r) {
  return r.reduce((i, e) => e ? i + e : i, 0);
}
const a = 0;
function Y(r, i) {
  let e = i.x - r.x, s = i.y - r.y;
  return e === a && s < a ? "N" : e > a && s < a ? "NE" : e > a && s === a ? "E" : e > a && s > a ? "SE" : e === a && s > a ? "S" : e < a && s > a ? "SW" : e < a && s === a ? "W" : e < a && s < a ? "NW" : "NONE";
}
class E {
  constructor({
    worldOrigin: i,
    baseTileOrigin: e,
    baseTileDimensions: s,
    getScreenDimensions: t,
    getWorldPosition: n,
    getWorldScale: h
  } = {}) {
    l(this, "getScreenDimensions");
    l(this, "getWorldPosition");
    l(this, "getWorldScale");
    l(this, "baseTileDimensions");
    l(this, "worldOrigin", T);
    l(this, "baseTileOrigin", T);
    l(this, "map", /* @__PURE__ */ new Map());
    l(this, "bounds", {
      x: { min: 0, max: 0 },
      y: { min: 0, max: 0 },
      z: { min: 0, max: 0 }
    });
    this.worldOrigin = i || T, this.baseTileOrigin = e || T, this.baseTileDimensions = s || { width: 1, height: 1 }, this.getScreenDimensions = t || (() => ({ width: 1, height: 1 })), this.getWorldPosition = n || (() => W), this.getWorldScale = h || (() => _);
  }
  add(i, e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return g(this.map, [e.z || 0, e.x, e.y], i), this.recalculateBounds(e), this.toWorldPoint(e, s, t);
  }
  get(i) {
    return A(this.map, i);
  }
  getColumn(i, e) {
    const s = [];
    for (const [t, n] of e || this.map)
      s[t] = w(n, [i.x, i.y]);
    return s;
  }
  move(i, e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    const n = this.remove(i);
    return n ? this.add(n, e, s, t) : null;
  }
  remove(i) {
    i.z === void 0 && (i.z = 0);
    const e = this.get(i);
    if (!!e)
      return z(this.map, [i.z || 0, i.x, i.y]), this.recalculateBounds(i), e;
  }
  toScreenPoint(i, e = this.baseTileDimensions, s = this.baseTileOrigin) {
    const t = this.toWorldPoint(i, e, s), n = this.getWorldScale(), h = this.getWorldPosition();
    return t.x = t.x * n.x + h.x, t.y = t.y * n.y + h.y, t;
  }
  toWorldPoint(i, e = this.baseTileDimensions, s = this.baseTileOrigin) {
    return this._project(this._getAbsolutePosition(i), e, s);
  }
  worldToTile(i, e = this.baseTileDimensions, s = this.baseTileOrigin) {
    const t = this._unproject(i);
    return {
      x: Math.round(t.x / e.width),
      y: Math.round(t.y / e.height),
      z: i.z || 0
    };
  }
  centerToTile(i) {
    return this.centerToPoint(this.toScreenPoint(i));
  }
  centerToPoint(i) {
    const e = this.getScreenDimensions(), s = this.getWorldPosition();
    return {
      x: s.x + e.width / 2 - i.x,
      y: s.y + e.height / 2 - i.y
    };
  }
  get centerTile() {
    return this.getBounds();
  }
  center() {
    return this.centerToTile(this.centerTile);
  }
  getBounds() {
    const i = {
      x: 0,
      y: 0,
      width: this.bounds.x.max - this.bounds.x.min,
      height: this.bounds.y.max - this.bounds.y.min,
      depth: this.bounds.z.max - this.bounds.z.min
    };
    return i.x = Math.round(this.bounds.x.min + i.width / 2), i.y = Math.round(this.bounds.y.min + i.height / 2), i;
  }
  recalculateBounds(i) {
    i.x < this.bounds.x.min && (this.bounds.x.min = i.x), i.x > this.bounds.x.max && (this.bounds.x.max = i.x), i.y < this.bounds.y.min && (this.bounds.y.min = i.y), i.y > this.bounds.y.max && (this.bounds.y.max = i.y), i.z !== void 0 && (i.z < this.bounds.z.min && (this.bounds.z.min = i.z), i.z > this.bounds.z.max && (this.bounds.z.max = i.z));
  }
  _project(i, e = this.baseTileDimensions, s = this.baseTileOrigin, t = 0) {
    const { width: n, height: h } = this.getScreenDimensions();
    return {
      x: i.x + n * this.worldOrigin.x,
      y: i.y + h * this.worldOrigin.y,
      z: i.z || 0
    };
  }
  _unproject(i, e = { x: 0, y: 0, z: 0 }) {
    const { width: s, height: t } = this.getScreenDimensions();
    return e.x = i.x - s * this.worldOrigin.x, e.y = i.y - t * this.worldOrigin.y + (i.z || 0), e.z = i.z || 0, e;
  }
  _getAbsolutePosition(i, e = this.baseTileDimensions, s = this.baseTileOrigin) {
    return {
      x: e.width * i.x,
      y: e.height * i.y,
      z: i.z || 0
    };
  }
}
class X extends E {
  constructor({ angle: e = O, clamp: s = !0, ...t } = { angle: O, clamp: !0 }) {
    super({ ...t });
    l(this, "angle");
    l(this, "angleCos");
    l(this, "angleSin");
    l(this, "clamp");
    l(this, "baseOrigin");
    l(this, "baseSurfaceHeight");
    l(this, "baseSurfaceHalfHeight");
    l(this, "tileDimensions", /* @__PURE__ */ new Map());
    this.angle = e, this.angleCos = Math.cos(this.angle), this.angleSin = Math.sin(this.angle), this.clamp = s, this.baseOrigin = {
      x: this.baseTileDimensions.width * this.baseTileOrigin.x,
      y: this.baseTileDimensions.height * this.baseTileOrigin.y
    }, this.baseSurfaceHeight = this.baseTileDimensions.height - this.baseTileDimensions.depth, this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2;
  }
  add(e, s, t = this.baseTileDimensions, n = this.baseTileOrigin) {
    const h = this.toWorldPoint(s, t, n);
    if (t !== this.baseTileDimensions) {
      let c = (t.depth || this.baseTileDimensions.depth) / this.baseTileDimensions.depth;
      for (let o = c, u = s.z || 0; o > 0; o--, u++)
        o > 1 ? g(this.tileDimensions, [u, s.x, s.y], {
          ...t,
          origin: n,
          depth: this.baseTileDimensions.depth,
          z: u,
          x: h.x,
          y: h.y,
          value: e
        }) : g(this.tileDimensions, [u, s.x, s.y], {
          ...t,
          origin: n,
          depth: this.baseTileDimensions.depth * o,
          z: u,
          x: h.x,
          y: h.y,
          value: e
        }), g(this.map, [u, s.x, s.y], s);
    } else
      g(this.tileDimensions, [s.z || 0, s.x, s.y], {
        ...t,
        origin: n,
        z: s.z || 0,
        x: h.x,
        y: h.y,
        value: e
      }), g(this.map, [s.z || 0, s.x, s.y], s);
    return this.recalculateBounds(s), h;
  }
  remove(e) {
    const s = this.get(e);
    if (!s)
      return null;
    for (const [t, n] of this.map)
      try {
        w(n, [e.x, e.y]) === s && (z(this.tileDimensions, [t, e.x, e.y]), z(this.map, [t, e.x, e.y]));
      } catch {
      }
    return this.recalculateBounds(e), s;
  }
  worldToTile(e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    const n = this._unproject(e), h = {
      x: s.width * t.x,
      y: s.width * t.y
    };
    return n.x = Math.floor((n.x + h.x) / h.x), n.y = Math.floor((n.y + h.y) / h.y), n.z = n.z || 0, n;
  }
  toWorldPoint(e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return this._project(
      this._getAbsolutePosition(e),
      s,
      t,
      j(
        this.getDimensionsColumn(e).map((n) => (n == null ? void 0 : n.depth) || this.baseTileDimensions.depth).slice(1, e.z || 0)
      )
    );
  }
  getDimensionsColumn(e) {
    return this.getColumn(e, this.tileDimensions);
  }
  castRay(e, s) {
    const t = this.worldToTile(e);
    for (let n = this.bounds.z.max; n >= this.bounds.z.min; n--) {
      const h = t.x + n, c = t.y + n;
      for (let o of this.getDimensionsColumn({
        x: h,
        y: c
      }).reverse()) {
        if (!o)
          continue;
        const { x: u, y: m, value: y, origin: x, width: b, height: f, tile: d } = o;
        if (e.x >= u - b * x.x && e.x <= u + b * x.x && e.y >= m - f * x.y && e.y <= m + f * x.y)
          if (s) {
            if (s(y, d))
              return y;
          } else
            return y;
      }
    }
  }
  collisionMap(e, s) {
    const t = /* @__PURE__ */ new Map(), n = this.worldToTile(e);
    for (let h = this.bounds.z.min; h <= this.bounds.z.max; h++) {
      let c = !1;
      const o = n.x + h, u = n.y + h;
      for (let m of this.getDimensionsColumn({
        x: o,
        y: u
      })) {
        if (!m)
          continue;
        const { x: y, y: x, value: b, z: f, origin: d, width: D, height: S, tile: P } = m;
        if (e.x >= y - D * d.x && e.x <= y + D * d.x && e.y >= x - S * d.y && e.y <= x + S * d.y) {
          if (s && !s(b, P))
            continue;
          c = !0, g(t, [f, o, u], b);
        } else if (c)
          break;
      }
    }
    return t;
  }
  _project(e, s = this.baseTileDimensions, t = this.baseTileOrigin, n = 0) {
    const { width: h, height: c } = this.getScreenDimensions(), o = {
      x: (e.x - e.y) * this.angleCos + h * this.worldOrigin.x,
      y: (e.x + e.y) * this.angleSin + c * this.worldOrigin.y,
      z: (e.x + e.y) * (e.z + 1 || 1)
    };
    return s !== this.baseTileDimensions ? (o.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y, o.y += s.height * t.y - (s.height - (s.height - s.depth) / 2), o.y -= n) : o.y -= this.baseTileDimensions.depth * e.z, this.clamp && (o.x = ~~(o.x + (o.x > 0 ? 0.5 : -0.5)), o.y = ~~(o.y + (o.y > 0 ? 0.5 : -0.5))), o;
  }
  _unproject(e, s = { x: 0, y: 0, z: 0 }) {
    const t = this.getScreenDimensions(), n = e.x - t.width * this.worldOrigin.x, h = e.y - t.height * this.worldOrigin.y;
    return s.x = n / (2 * this.angleCos) + h / (2 * this.angleSin), s.y = -(n / (2 * this.angleCos)) + h / (2 * this.angleSin), s.z = e.z || 0, s;
  }
  _getAbsolutePosition(e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return {
      x: s.width * t.x * e.x,
      y: s.height * t.y * e.y,
      z: e.z || 0
    };
  }
}
export {
  O as CLASSIC,
  H as DIRECTION,
  _ as FULL,
  C as ISOMETRIC,
  X as IsoTilemap,
  T as MIDDLE,
  L as MILITARY,
  W as TOP_LEFT,
  E as Tilemap,
  k as collectRay,
  w as get,
  Y as getDirection,
  N as getDistance,
  A as pointGet,
  z as remove,
  g as set,
  j as sum
};
