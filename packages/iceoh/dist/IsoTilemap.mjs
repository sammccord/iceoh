var w = Object.defineProperty;
var C = (x, r, e) => r in x ? w(x, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : x[r] = e;
var l = (x, r, e) => (C(x, typeof r != "symbol" ? r + "" : r, e), e);
import { Tilemap as O } from "./Tilemap.mjs";
import { CLASSIC as z, set as b, get as H, remove as d, sum as v } from "./utils.mjs";
class p extends O {
  constructor({ angle: e = z, clamp: s = !0, ...h } = {
    angle: z,
    clamp: !0
  }) {
    super({ ...h });
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
  add(e, s, h = this.baseTileDimensions, t = this.baseTileOrigin) {
    const i = this.toWorldPoint(s, h, t);
    if (h !== this.baseTileDimensions) {
      let o = (h.depth || this.baseDepth) / this.baseDepth;
      for (let n = o, a = s.z || 0; n > 0; n--, a++)
        n > 1 ? b(this.tileDimensions, [a, s.x, s.y], {
          ...h,
          origin: t,
          depth: this.baseDepth,
          z: a,
          x: i.x,
          y: i.y,
          value: e
        }) : b(this.tileDimensions, [a, s.x, s.y], {
          ...h,
          origin: t,
          depth: this.baseDepth * n,
          z: a,
          x: i.x,
          y: i.y,
          value: e
        }), b(this.map, [a, s.x, s.y], s);
    } else
      b(this.tileDimensions, [s.z || 0, s.x, s.y], {
        ...h,
        origin: t,
        z: s.z || 0,
        x: i.x,
        y: i.y,
        value: e
      }), b(this.map, [s.z || 0, s.x, s.y], s);
    return this.recalculateBounds(s), i;
  }
  remove(e) {
    const s = this.get(e);
    if (!!s) {
      for (const [h, t] of this.map)
        try {
          H(t, [e.x, e.y]) === s && (d(this.tileDimensions, [h, e.x, e.y]), d(this.map, [h, e.x, e.y]));
        } catch {
        }
      return this.recalculateBounds(e), s;
    }
  }
  worldToTile(e, s = this.baseTileDimensions, h = this.baseTileOrigin) {
    const t = this.screenUnproject(e), i = {
      x: s.width * h.x,
      y: s.width * h.y
    };
    return t.x = Math.floor((t.x + i.x) / i.x), t.y = Math.floor((t.y + i.y) / i.y), t.z = t.z || 0, t;
  }
  toWorldPoint(e, s = this.baseTileDimensions, h = this.baseTileOrigin) {
    return this.screenProject(
      this.getAbsolutePosition(e),
      s,
      h,
      v(
        this.getDimensionsColumn(e).map((t) => (t == null ? void 0 : t.depth) || this.baseTileDimensions.depth).slice(1, e.z || 0)
      )
    );
  }
  getDimensionsColumn(e) {
    return this.getColumn(e, this.tileDimensions);
  }
  castRay(e, s) {
    const h = this.worldToTile(e);
    for (let t = this.bounds.z.max; t >= this.bounds.z.min; t--) {
      const i = h.x + t, o = h.y + t;
      for (let n of this.getDimensionsColumn({
        x: i,
        y: o
      }).reverse()) {
        if (!n)
          continue;
        const { x: a, y: u, value: g, origin: y, width: f, height: m, tile: c } = n;
        if (e.x >= a - f * y.x && e.x <= a + f * y.x && e.y >= u - m * y.y && e.y <= u + m * y.y)
          if (s) {
            if (s(g, c))
              return g;
          } else
            return g;
      }
    }
  }
  collisionMap(e, s) {
    const h = /* @__PURE__ */ new Map(), t = this.worldToTile(e);
    for (let i = this.bounds.z.min; i <= this.bounds.z.max; i++) {
      let o = !1;
      const n = t.x + i, a = t.y + i;
      for (let u of this.getDimensionsColumn({
        x: n,
        y: a
      })) {
        if (!u)
          continue;
        const { x: g, y, value: f, z: m, origin: c, width: D, height: T, tile: S } = u;
        if (e.x >= g - D * c.x && e.x <= g + D * c.x && e.y >= y - T * c.y && e.y <= y + T * c.y) {
          if (s && !s(f, S))
            continue;
          o = !0, b(h, [m || 0, n, a], f);
        } else if (o)
          break;
      }
    }
    return h;
  }
  project(e, s = this.baseTileDimensions, h = this.baseTileOrigin, t = 0) {
    const i = {
      x: (e.x - e.y) * this.angleCos,
      y: (e.x + e.y) * this.angleSin,
      z: (e.x + e.y) * ((e.z || 0) + 1 || 1)
    };
    return s !== this.baseTileDimensions ? (i.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y, i.y += s.height * h.y - (s.height - (s.height - (s.depth || 0)) / 2), i.y -= t) : i.y -= this.baseDepth * (e.z || 0), this.clamp && (i.x = ~~(i.x + (i.x > 0 ? 0.5 : -0.5)), i.y = ~~(i.y + (i.y > 0 ? 0.5 : -0.5))), i;
  }
  screenProject(e, s = this.baseTileDimensions, h = this.baseTileOrigin, t = 0) {
    const { width: i, height: o } = this.getScreenDimensions(), n = {
      x: (e.x - e.y) * this.angleCos + i * this.worldOrigin.x,
      y: (e.x + e.y) * this.angleSin + o * this.worldOrigin.y,
      z: (e.x + e.y) * ((e.z || 0) + 1 || 1)
    };
    return s !== this.baseTileDimensions ? (n.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y, n.y += s.height * h.y - (s.height - (s.height - (s.depth || 0)) / 2), n.y -= t) : n.y -= this.baseDepth * (e.z || 0), this.clamp && (n.x = ~~(n.x + (n.x > 0 ? 0.5 : -0.5)), n.y = ~~(n.y + (n.y > 0 ? 0.5 : -0.5))), n;
  }
  unproject(e, s = { x: 0, y: 0, z: 0 }) {
    return s.x = e.x / (2 * this.angleCos) + e.y / (2 * this.angleSin), s.y = -(e.x / (2 * this.angleCos)) + e.y / (2 * this.angleSin), s.z = e.z || 0, s;
  }
  screenUnproject(e, s = { x: 0, y: 0, z: 0 }) {
    const h = this.getScreenDimensions(), t = e.x - h.width * this.worldOrigin.x, i = e.y - h.height * this.worldOrigin.y;
    return s.x = t / (2 * this.angleCos) + i / (2 * this.angleSin), s.y = -(t / (2 * this.angleCos)) + i / (2 * this.angleSin), s.z = e.z || 0, s;
  }
  getAbsolutePosition(e, s = this.baseTileDimensions, h = this.baseTileOrigin) {
    return {
      x: s.width * h.x * e.x,
      y: s.height * h.y * e.y,
      z: e.z || 0
    };
  }
}
export {
  p as IsoTilemap
};
