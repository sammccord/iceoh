var M = Object.defineProperty;
var W = (r, i, e) => i in r ? M(r, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[i] = e;
var a = (r, i, e) => (W(r, typeof i != "symbol" ? i + "" : i, e), e);
const P = Math.atan(0.5), B = Math.PI / 6, L = Math.PI / 4, _ = { x: 0, y: 0 }, z = { x: 0.5, y: 0.5 }, H = { x: 1, y: 1 };
var A = /* @__PURE__ */ ((r) => (r.NONE = "NONE", r.N = "N", r.NE = "NE", r.E = "E", r.SE = "SE", r.S = "S", r.SW = "SW", r.W = "W", r.NW = "NW", r))(A || {});
function N(r) {
  const i = [];
  for (const e of Array.from(r.keys()).sort()) {
    const t = r.get(e);
    for (const s of Array.from(t.keys()).sort()) {
      const n = t.get(s);
      for (const h of Array.from(n.keys()).sort())
        i.push(n.get(h));
    }
  }
  return i;
}
function x(r, i, e) {
  let t = r;
  for (; i.length - 1; ) {
    var s = i.shift();
    let n = t.get(s);
    if (n === void 0) {
      const h = /* @__PURE__ */ new Map();
      t.set(s, h), t = h;
    } else
      t = n;
  }
  return t.set(i[0], e), e;
}
function w(r, i, e) {
  for (var t = r; i.length; ) {
    var s = i.shift();
    let n = t.get(s);
    if (n === void 0) {
      if (e && !i.length)
        return t.set(s, e), e;
      if (e)
        n = /* @__PURE__ */ new Map(), t.set(s, n);
      else
        return;
    }
    t = n;
  }
  return t;
}
function j(r, i) {
  return w(r, [i.z || 0, i.x, i.y]);
}
function T(r, i) {
  let e = r;
  for (; i.length - 1; ) {
    var t = i.shift();
    let s = e.get(t);
    if (s === void 0)
      return !1;
    e = s;
  }
  return e.delete(i[0]);
}
function Y(r, i) {
  return Math.sqrt(
    (i.x - r.x) * (i.x - r.x) + (i.y - r.y) * (i.y - r.y)
  );
}
function k(r) {
  return {
    x: D(r.map((i) => i.x)) / r.length,
    y: D(r.map((i) => i.y)) / r.length
  };
}
function D(r) {
  return r.reduce((i, e) => e ? i + e : i, 0);
}
const l = 0;
function X(r, i) {
  let e = i.x - r.x, t = i.y - r.y;
  return e === l && t < l ? "N" : e > l && t < l ? "NE" : e > l && t === l ? "E" : e > l && t > l ? "SE" : e === l && t > l ? "S" : e < l && t > l ? "SW" : e < l && t === l ? "W" : e < l && t < l ? "NW" : "NONE";
}
class C {
  constructor({
    worldOrigin: i,
    baseTileOrigin: e,
    baseTileDimensions: t,
    getScreenDimensions: s,
    getWorldPosition: n,
    getWorldScale: h
  } = {}) {
    a(this, "getScreenDimensions");
    a(this, "getWorldPosition");
    a(this, "getWorldScale");
    a(this, "baseTileDimensions");
    a(this, "worldOrigin", z);
    a(this, "baseTileOrigin", z);
    a(this, "map", /* @__PURE__ */ new Map());
    a(this, "bounds", {
      x: { min: 0, max: 0 },
      y: { min: 0, max: 0 },
      z: { min: 0, max: 0 }
    });
    this.worldOrigin = i || z, this.baseTileOrigin = e || z, this.baseTileDimensions = t || { width: 1, height: 1 }, this.getScreenDimensions = s || (() => ({ width: 1, height: 1 })), this.getWorldPosition = n || (() => _), this.getWorldScale = h || (() => H);
  }
  add(i, e, t = this.baseTileDimensions, s = this.baseTileOrigin) {
    return x(this.map, [e.z || 0, e.x, e.y], i), this.recalculateBounds(e), this.toWorldPoint(e, t, s);
  }
  get(i) {
    return j(this.map, i);
  }
  getColumn(i, e) {
    const t = [];
    for (const [s, n] of e || this.map)
      t[s] = w(n, [i.x, i.y]);
    return t;
  }
  move(i, e, t = this.baseTileDimensions, s = this.baseTileOrigin, n) {
    const h = this.remove(i);
    if (!(!h || !n))
      return this.add(h || n, e, t, s);
  }
  remove(i) {
    i.z === void 0 && (i.z = 0);
    const e = this.get(i);
    if (!!e)
      return T(this.map, [i.z || 0, i.x, i.y]), this.recalculateBounds(i), e;
  }
  toScreenPoint(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    const s = this.toWorldPoint(i, e, t), n = this.getWorldScale(), h = this.getWorldPosition();
    return s.x = s.x * n.x + h.x, s.y = s.y * n.y + h.y, s;
  }
  toWorldPoint(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    return this._project(this._getAbsolutePosition(i), e, t);
  }
  worldToTile(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    const s = this._unproject(i);
    return {
      x: Math.round(s.x / e.width),
      y: Math.round(s.y / e.height),
      z: i.z || 0
    };
  }
  centerToTile(i) {
    return this.centerToPoint(this.toScreenPoint(i));
  }
  centerToPoint(i) {
    const e = this.getScreenDimensions(), t = this.getWorldPosition();
    return {
      x: t.x + e.width / 2 - i.x,
      y: t.y + e.height / 2 - i.y
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
  _project(i, e = this.baseTileDimensions, t = this.baseTileOrigin, s = 0) {
    const { width: n, height: h } = this.getScreenDimensions();
    return {
      x: i.x + n * this.worldOrigin.x,
      y: i.y + h * this.worldOrigin.y,
      z: i.z || 0
    };
  }
  _unproject(i, e = { x: 0, y: 0, z: 0 }) {
    const { width: t, height: s } = this.getScreenDimensions();
    return e.x = i.x - t * this.worldOrigin.x, e.y = i.y - s * this.worldOrigin.y + (i.z || 0), e.z = i.z || 0, e;
  }
  _getAbsolutePosition(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    return {
      x: e.width * i.x,
      y: e.height * i.y,
      z: i.z || 0
    };
  }
}
class F extends C {
  constructor({ angle: e = P, clamp: t = !0, ...s } = {
    angle: P,
    clamp: !0
  }) {
    super({ ...s });
    a(this, "angle");
    a(this, "angleCos");
    a(this, "angleSin");
    a(this, "clamp");
    a(this, "baseOrigin");
    a(this, "baseSurfaceHeight");
    a(this, "baseSurfaceHalfHeight");
    a(this, "tileDimensions", /* @__PURE__ */ new Map());
    this.angle = e, this.angleCos = Math.cos(this.angle), this.angleSin = Math.sin(this.angle), this.clamp = t, this.baseOrigin = {
      x: this.baseTileDimensions.width * this.baseTileOrigin.x,
      y: this.baseTileDimensions.height * this.baseTileOrigin.y
    }, this.baseSurfaceHeight = this.baseTileDimensions.height - (this.baseTileDimensions.depth || 1), this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2;
  }
  get baseDepth() {
    return this.baseTileDimensions.depth || 1;
  }
  add(e, t, s = this.baseTileDimensions, n = this.baseTileOrigin) {
    const h = this.toWorldPoint(t, s, n);
    if (s !== this.baseTileDimensions) {
      let c = (s.depth || this.baseDepth) / this.baseDepth;
      for (let o = c, u = t.z || 0; o > 0; o--, u++)
        o > 1 ? x(this.tileDimensions, [u, t.x, t.y], {
          ...s,
          origin: n,
          depth: this.baseDepth,
          z: u,
          x: h.x,
          y: h.y,
          value: e
        }) : x(this.tileDimensions, [u, t.x, t.y], {
          ...s,
          origin: n,
          depth: this.baseDepth * o,
          z: u,
          x: h.x,
          y: h.y,
          value: e
        }), x(this.map, [u, t.x, t.y], t);
    } else
      x(this.tileDimensions, [t.z || 0, t.x, t.y], {
        ...s,
        origin: n,
        z: t.z || 0,
        x: h.x,
        y: h.y,
        value: e
      }), x(this.map, [t.z || 0, t.x, t.y], t);
    return this.recalculateBounds(t), h;
  }
  remove(e) {
    const t = this.get(e);
    if (!!t) {
      for (const [s, n] of this.map)
        try {
          w(n, [e.x, e.y]) === t && (T(this.tileDimensions, [s, e.x, e.y]), T(this.map, [s, e.x, e.y]));
        } catch {
        }
      return this.recalculateBounds(e), t;
    }
  }
  worldToTile(e, t = this.baseTileDimensions, s = this.baseTileOrigin) {
    const n = this._unproject(e), h = {
      x: t.width * s.x,
      y: t.width * s.y
    };
    return n.x = Math.floor((n.x + h.x) / h.x), n.y = Math.floor((n.y + h.y) / h.y), n.z = n.z || 0, n;
  }
  toWorldPoint(e, t = this.baseTileDimensions, s = this.baseTileOrigin) {
    return this._project(
      this._getAbsolutePosition(e),
      t,
      s,
      D(
        this.getDimensionsColumn(e).map((n) => (n == null ? void 0 : n.depth) || this.baseTileDimensions.depth).slice(1, e.z || 0)
      )
    );
  }
  getDimensionsColumn(e) {
    return this.getColumn(e, this.tileDimensions);
  }
  castRay(e, t) {
    const s = this.worldToTile(e);
    for (let n = this.bounds.z.max; n >= this.bounds.z.min; n--) {
      const h = s.x + n, c = s.y + n;
      for (let o of this.getDimensionsColumn({
        x: h,
        y: c
      }).reverse()) {
        if (!o)
          continue;
        const { x: u, y: m, value: y, origin: g, width: b, height: f, tile: d } = o;
        if (e.x >= u - b * g.x && e.x <= u + b * g.x && e.y >= m - f * g.y && e.y <= m + f * g.y)
          if (t) {
            if (t(y, d))
              return y;
          } else
            return y;
      }
    }
  }
  collisionMap(e, t) {
    const s = /* @__PURE__ */ new Map(), n = this.worldToTile(e);
    for (let h = this.bounds.z.min; h <= this.bounds.z.max; h++) {
      let c = !1;
      const o = n.x + h, u = n.y + h;
      for (let m of this.getDimensionsColumn({
        x: o,
        y: u
      })) {
        if (!m)
          continue;
        const { x: y, y: g, value: b, z: f, origin: d, width: S, height: O, tile: v } = m;
        if (e.x >= y - S * d.x && e.x <= y + S * d.x && e.y >= g - O * d.y && e.y <= g + O * d.y) {
          if (t && !t(b, v))
            continue;
          c = !0, x(s, [f || 0, o, u], b);
        } else if (c)
          break;
      }
    }
    return s;
  }
  _project(e, t = this.baseTileDimensions, s = this.baseTileOrigin, n = 0) {
    const { width: h, height: c } = this.getScreenDimensions(), o = {
      x: (e.x - e.y) * this.angleCos + h * this.worldOrigin.x,
      y: (e.x + e.y) * this.angleSin + c * this.worldOrigin.y,
      z: (e.x + e.y) * ((e.z || 0) + 1 || 1)
    };
    return t !== this.baseTileDimensions ? (o.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y, o.y += t.height * s.y - (t.height - (t.height - (t.depth || 0)) / 2), o.y -= n) : o.y -= this.baseDepth * (e.z || 0), this.clamp && (o.x = ~~(o.x + (o.x > 0 ? 0.5 : -0.5)), o.y = ~~(o.y + (o.y > 0 ? 0.5 : -0.5))), o;
  }
  _unproject(e, t = { x: 0, y: 0, z: 0 }) {
    const s = this.getScreenDimensions(), n = e.x - s.width * this.worldOrigin.x, h = e.y - s.height * this.worldOrigin.y;
    return t.x = n / (2 * this.angleCos) + h / (2 * this.angleSin), t.y = -(n / (2 * this.angleCos)) + h / (2 * this.angleSin), t.z = e.z || 0, t;
  }
  _getAbsolutePosition(e, t = this.baseTileDimensions, s = this.baseTileOrigin) {
    return {
      x: t.width * s.x * e.x,
      y: t.height * s.y * e.y,
      z: e.z || 0
    };
  }
}
export {
  P as CLASSIC,
  A as DIRECTION,
  H as FULL,
  B as ISOMETRIC,
  F as IsoTilemap,
  z as MIDDLE,
  L as MILITARY,
  _ as TOP_LEFT,
  C as Tilemap,
  N as collectRay,
  w as get,
  k as getCenter,
  X as getDirection,
  Y as getDistance,
  j as pointGet,
  T as remove,
  x as set,
  D as sum
};
