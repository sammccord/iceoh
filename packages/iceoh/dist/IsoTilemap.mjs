var S = Object.defineProperty;
var O = (x, o, e) => o in x ? S(x, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : x[o] = e;
var l = (x, o, e) => (O(x, typeof o != "symbol" ? o + "" : o, e), e);
import { Tilemap as C } from "./Tilemap.mjs";
import { CLASSIC as d, set as u, get as p, remove as z, sum as H } from "./utils.mjs";
class j extends C {
  constructor({ angle: e = d, clamp: s = !0, ...t } = {
    angle: d,
    clamp: !0
  }) {
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
    }, this.baseSurfaceHeight = this.baseTileDimensions.height - (this.baseTileDimensions.depth || 1), this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2;
  }
  get baseDepth() {
    return this.baseTileDimensions.depth || 1;
  }
  add(e, s, t = this.baseTileDimensions, i = this.baseTileOrigin) {
    const h = this.toWorldPoint(s, t, i);
    if (t !== this.baseTileDimensions) {
      let r = (t.depth || this.baseDepth) / this.baseDepth;
      for (let n = r, a = s.z || 0; n > 0; n--, a++)
        n > 1 ? u(this.tileDimensions, [a, s.x, s.y], {
          ...t,
          origin: i,
          depth: this.baseDepth,
          z: a,
          x: h.x,
          y: h.y,
          value: e
        }) : u(this.tileDimensions, [a, s.x, s.y], {
          ...t,
          origin: i,
          depth: this.baseDepth * n,
          z: a,
          x: h.x,
          y: h.y,
          value: e
        }), u(this.map, [a, s.x, s.y], s);
    } else
      u(this.tileDimensions, [s.z || 0, s.x, s.y], {
        ...t,
        origin: i,
        z: s.z || 0,
        x: h.x,
        y: h.y,
        value: e
      }), u(this.map, [s.z || 0, s.x, s.y], s);
    return this.recalculateBounds(s), h;
  }
  remove(e) {
    const s = this.get(e);
    if (!!s) {
      for (const [t, i] of this.map)
        try {
          p(i, [e.x, e.y]) === s && (z(this.tileDimensions, [t, e.x, e.y]), z(this.map, [t, e.x, e.y]));
        } catch {
        }
      return this.recalculateBounds(e), s;
    }
  }
  worldToTile(e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    const i = this._unproject(e), h = {
      x: s.width * t.x,
      y: s.width * t.y
    };
    return i.x = Math.floor((i.x + h.x) / h.x), i.y = Math.floor((i.y + h.y) / h.y), i.z = i.z || 0, i;
  }
  toWorldPoint(e, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return this._project(
      this._getAbsolutePosition(e),
      s,
      t,
      H(
        this.getDimensionsColumn(e).map((i) => (i == null ? void 0 : i.depth) || this.baseTileDimensions.depth).slice(1, e.z || 0)
      )
    );
  }
  getDimensionsColumn(e) {
    return this.getColumn(e, this.tileDimensions);
  }
  castRay(e, s) {
    const t = this.worldToTile(e);
    for (let i = this.bounds.z.max; i >= this.bounds.z.min; i--) {
      const h = t.x + i, r = t.y + i;
      for (let n of this.getDimensionsColumn({
        x: h,
        y: r
      }).reverse()) {
        if (!n)
          continue;
        const { x: a, y: m, value: g, origin: y, width: b, height: f, tile: c } = n;
        if (e.x >= a - b * y.x && e.x <= a + b * y.x && e.y >= m - f * y.y && e.y <= m + f * y.y)
          if (s) {
            if (s(g, c))
              return g;
          } else
            return g;
      }
    }
  }
  collisionMap(e, s) {
    const t = /* @__PURE__ */ new Map(), i = this.worldToTile(e);
    for (let h = this.bounds.z.min; h <= this.bounds.z.max; h++) {
      let r = !1;
      const n = i.x + h, a = i.y + h;
      for (let m of this.getDimensionsColumn({
        x: n,
        y: a
      })) {
        if (!m)
          continue;
        const { x: g, y, value: b, z: f, origin: c, width: D, height: T, tile: w } = m;
        if (e.x >= g - D * c.x && e.x <= g + D * c.x && e.y >= y - T * c.y && e.y <= y + T * c.y) {
          if (s && !s(b, w))
            continue;
          r = !0, u(t, [f || 0, n, a], b);
        } else if (r)
          break;
      }
    }
    return t;
  }
  _project(e, s = this.baseTileDimensions, t = this.baseTileOrigin, i = 0) {
    const { width: h, height: r } = this.getScreenDimensions(), n = {
      x: (e.x - e.y) * this.angleCos + h * this.worldOrigin.x,
      y: (e.x + e.y) * this.angleSin + r * this.worldOrigin.y,
      z: (e.x + e.y) * ((e.z || 0) + 1 || 1)
    };
    return s !== this.baseTileDimensions ? (n.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y, n.y += s.height * t.y - (s.height - (s.height - (s.depth || 0)) / 2), n.y -= i) : n.y -= this.baseDepth * (e.z || 0), this.clamp && (n.x = ~~(n.x + (n.x > 0 ? 0.5 : -0.5)), n.y = ~~(n.y + (n.y > 0 ? 0.5 : -0.5))), n;
  }
  _unproject(e, s = { x: 0, y: 0, z: 0 }) {
    const t = this.getScreenDimensions(), i = e.x - t.width * this.worldOrigin.x, h = e.y - t.height * this.worldOrigin.y;
    return s.x = i / (2 * this.angleCos) + h / (2 * this.angleSin), s.y = -(i / (2 * this.angleCos)) + h / (2 * this.angleSin), s.z = e.z || 0, s;
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
  j as IsoTilemap
};
