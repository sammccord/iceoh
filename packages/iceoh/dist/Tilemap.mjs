var m = Object.defineProperty;
var g = (o, i, s) => i in o ? m(o, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : o[i] = s;
var h = (o, i, s) => (g(o, typeof i != "symbol" ? i + "" : i, s), s);
import { MIDDLE as x, TOP_LEFT as y, FULL as c, set as l, pointGet as z, get as b, remove as T } from "./utils.mjs";
class P {
  constructor({
    worldOrigin: i,
    baseTileOrigin: s,
    baseTileDimensions: t,
    getScreenDimensions: e,
    getWorldPosition: r,
    getWorldScale: n
  } = {}) {
    h(this, "getScreenDimensions");
    h(this, "getWorldPosition");
    h(this, "getWorldScale");
    h(this, "baseTileDimensions");
    h(this, "worldOrigin", x);
    h(this, "baseTileOrigin", x);
    h(this, "map", /* @__PURE__ */ new Map());
    h(this, "bounds", {
      x: { min: 0, max: 0 },
      y: { min: 0, max: 0 },
      z: { min: 0, max: 0 }
    });
    this.worldOrigin = i || x, this.baseTileOrigin = s || x, this.baseTileDimensions = t || { width: 1, height: 1 }, this.getScreenDimensions = e || (() => ({ width: 1, height: 1 })), this.getWorldPosition = r || (() => y), this.getWorldScale = n || (() => c);
  }
  add(i, s, t = this.baseTileDimensions, e = this.baseTileOrigin) {
    return l(this.map, [s.z || 0, s.x, s.y], i), this.recalculateBounds(s), this.toWorldPoint(s, t, e);
  }
  addMany(i, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return i.map(([e, r]) => this.add(e, r, s, t));
  }
  set(i, s) {
    return l(this.map, [s.z || 0, s.x, s.y], i), this.recalculateBounds(s), () => this.remove(s);
  }
  setMany(i) {
    return i.map(([s, t]) => this.set(s, t));
  }
  get(i) {
    return z(this.map, i);
  }
  getColumn(i, s) {
    const t = [];
    for (const [e, r] of s || this.map)
      t[e] = b(r, [i.x, i.y]);
    return t;
  }
  move(i, s, t = this.baseTileDimensions, e = this.baseTileOrigin, r) {
    const n = this.remove(i);
    if (!(!n || !r))
      return this.add(n || r, s, t, e);
  }
  remove(i) {
    i.z === void 0 && (i.z = 0);
    const s = this.get(i);
    if (!!s)
      return T(this.map, [i.z || 0, i.x, i.y]), this.recalculateBounds(i), s;
  }
  toScreenPoint(i, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    const e = this.toWorldPoint(i, s, t), r = this.getWorldScale(), n = this.getWorldPosition();
    return e.x = e.x * r.x + n.x, e.y = e.y * r.y + n.y, e;
  }
  toWorldPoint(i, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return this._project(this._getAbsolutePosition(i), s, t);
  }
  worldToTile(i, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    const e = this._unproject(i);
    return {
      x: Math.round(e.x / s.width),
      y: Math.round(e.y / s.height),
      z: i.z || 0
    };
  }
  centerToTile(i) {
    return this.centerToPoint(this.toScreenPoint(i));
  }
  centerToPoint(i) {
    const s = this.getScreenDimensions(), t = this.getWorldPosition();
    return {
      x: t.x + s.width / 2 - i.x,
      y: t.y + s.height / 2 - i.y
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
      depth: this.bounds.z.max - this.bounds.z.min,
      z: 0
    };
    return i.x = Math.round(this.bounds.x.min + i.width / 2), i.y = Math.round(this.bounds.y.min + i.height / 2), i;
  }
  each(i) {
    for (const [s, t] of this.map)
      for (const [e, r] of t)
        for (const [n, a] of r)
          if (i(a, { x: e, y: n, z: s }) === !1)
            return;
  }
  within(i, s, t) {
    for (let e = i.z || 0; e < (s.z || 1); e++) {
      const r = this.map.get(e);
      for (let n = i.x; n <= s.x; n++) {
        const a = r && r.get(n);
        for (let d = i.y; d <= s.y; d++) {
          const u = a && a.get(d);
          if (t(u, { x: n, y: d, z: e }) === !1)
            return;
        }
      }
    }
  }
  neighbors(i, s) {
    this.within(
      { x: i.x - 1, y: i.y - 1, z: i.z || 0 },
      { x: i.x + 1, y: i.y + 1, z: i.z || 0 },
      (t, e) => {
        if (!(e.x === i.x && e.y === i.y && e.z === (i.z || 0)))
          return s(t, e);
      }
    );
  }
  around(i, s, t, e) {
    this.within(
      { x: i.x - s, y: i.y - s, z: i.z || 0 },
      { x: i.x + s, y: i.y + s, z: i.z || 0 },
      (r, n) => {
        if (!(n.x === i.x && n.y === i.y && n.z === (i.z || 0)) && t(r, n) !== !1)
          return e(r, n);
      }
    );
  }
  recalculateBounds(i) {
    i.x < this.bounds.x.min && (this.bounds.x.min = i.x), i.x > this.bounds.x.max && (this.bounds.x.max = i.x), i.y < this.bounds.y.min && (this.bounds.y.min = i.y), i.y > this.bounds.y.max && (this.bounds.y.max = i.y), i.z !== void 0 && (i.z < this.bounds.z.min && (this.bounds.z.min = i.z), i.z > this.bounds.z.max && (this.bounds.z.max = i.z));
  }
  _project(i, s = this.baseTileDimensions, t = this.baseTileOrigin, e = 0) {
    const { width: r, height: n } = this.getScreenDimensions();
    return {
      x: i.x + r * this.worldOrigin.x,
      y: i.y + n * this.worldOrigin.y,
      z: i.z || 0
    };
  }
  _unproject(i, s = { x: 0, y: 0, z: 0 }) {
    const { width: t, height: e } = this.getScreenDimensions();
    return s.x = i.x - t * this.worldOrigin.x, s.y = i.y - e * this.worldOrigin.y + (i.z || 0), s.z = i.z || 0, s;
  }
  _getAbsolutePosition(i, s = this.baseTileDimensions, t = this.baseTileOrigin) {
    return {
      x: s.width * i.x,
      y: s.height * i.y,
      z: i.z || 0
    };
  }
}
export {
  P as Tilemap
};
