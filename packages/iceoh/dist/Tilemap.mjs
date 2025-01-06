var u = Object.defineProperty;
var y = (o, i, e) => i in o ? u(o, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[i] = e;
var h = (o, i, e) => (y(o, typeof i != "symbol" ? i + "" : i, e), e);
import { MIDDLE as d, TOP_LEFT as c, FULL as g, set as l, pointGet as z, get as b, remove as T } from "./utils.mjs";
class P {
  constructor({
    worldOrigin: i,
    baseTileOrigin: e,
    baseTileDimensions: t,
    getScreenDimensions: s,
    getWorldPosition: r,
    getWorldScale: n
  } = {}) {
    h(this, "getScreenDimensions");
    h(this, "getWorldPosition");
    h(this, "getWorldScale");
    h(this, "baseTileDimensions");
    h(this, "worldOrigin", d);
    h(this, "baseTileOrigin", d);
    h(this, "map", /* @__PURE__ */ new Map());
    h(this, "bounds", {
      x: { min: 0, max: 0 },
      y: { min: 0, max: 0 },
      z: { min: 0, max: 0 }
    });
    this.worldOrigin = i || d, this.baseTileOrigin = e || d, this.baseTileDimensions = t || { width: 1, height: 1 }, this.getScreenDimensions = s || (() => ({ width: 1, height: 1 })), this.getWorldPosition = r || (() => c), this.getWorldScale = n || (() => g);
  }
  add(i, e, t = this.baseTileDimensions, s = this.baseTileOrigin) {
    return l(this.map, [e.z || 0, e.x, e.y], i), this.recalculateBounds(e), this.toWorldPoint(e, t, s);
  }
  addMany(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    return i.map(([s, r]) => this.add(s, r, e, t));
  }
  set(i, e) {
    return l(this.map, [e.z || 0, e.x, e.y], i), this.recalculateBounds(e), () => this.remove(e);
  }
  setMany(i) {
    return i.map(([e, t]) => this.set(e, t));
  }
  get(i) {
    return z(this.map, i);
  }
  getColumn(i, e) {
    const t = [];
    for (const [s, r] of e || this.map)
      t[s] = b(r, [i.x, i.y]);
    return t;
  }
  move(i, e, t = this.baseTileDimensions, s = this.baseTileOrigin, r) {
    const n = this.remove(i);
    if (!(!n || !r))
      return this.add(n || r, e, t, s);
  }
  remove(i) {
    i.z === void 0 && (i.z = 0);
    const e = this.get(i);
    if (!!e)
      return T(this.map, [i.z || 0, i.x, i.y]), this.recalculateBounds(i), e;
  }
  toScreenPoint(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    const s = this.toWorldPoint(i, e, t), r = this.getWorldScale(), n = this.getWorldPosition();
    return s.x = s.x * r.x + n.x, s.y = s.y * r.y + n.y, s;
  }
  toWorldPoint(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    return this.screenProject(this.getAbsolutePosition(i), e, t);
  }
  worldToTile(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    const s = this.screenUnproject(i);
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
      depth: this.bounds.z.max - this.bounds.z.min,
      z: 0
    };
    return i.x = Math.round(this.bounds.x.min + i.width / 2), i.y = Math.round(this.bounds.y.min + i.height / 2), i;
  }
  each(i) {
    for (const [e, t] of this.map)
      for (const [s, r] of t)
        for (const [n, a] of r)
          if (i(a, { x: s, y: n, z: e }) === !1)
            return;
  }
  within(i, e, t) {
    for (let s = i.z || 0; s < (e.z || 1); s++) {
      const r = this.map.get(s);
      for (let n = i.x; n <= e.x; n++) {
        const a = r && r.get(n);
        for (let x = i.y; x <= e.y; x++) {
          const m = a && a.get(x);
          if (t(m, { x: n, y: x, z: s }) === !1)
            return;
        }
      }
    }
  }
  neighbors(i, e) {
    this.within(
      { x: i.x - 1, y: i.y - 1, z: i.z || 0 },
      { x: i.x + 1, y: i.y + 1, z: i.z || 0 },
      (t, s) => {
        if (!(s.x === i.x && s.y === i.y && s.z === (i.z || 0)))
          return e(t, s);
      }
    );
  }
  around(i, e, t, s) {
    this.within(
      { x: i.x - e, y: i.y - e, z: i.z || 0 },
      { x: i.x + e, y: i.y + e, z: i.z || 0 },
      (r, n) => {
        if (!(n.x === i.x && n.y === i.y && n.z === (i.z || 0)) && t(r, n) !== !1)
          return s(r, n);
      }
    );
  }
  recalculateBounds(i) {
    i.x < this.bounds.x.min && (this.bounds.x.min = i.x), i.x > this.bounds.x.max && (this.bounds.x.max = i.x), i.y < this.bounds.y.min && (this.bounds.y.min = i.y), i.y > this.bounds.y.max && (this.bounds.y.max = i.y), i.z !== void 0 && (i.z < this.bounds.z.min && (this.bounds.z.min = i.z), i.z > this.bounds.z.max && (this.bounds.z.max = i.z));
  }
  project(i, e = this.baseTileDimensions, t = this.baseTileOrigin, s = 0) {
    return {
      x: i.x,
      y: i.y,
      z: i.z || 0
    };
  }
  screenProject(i, e = this.baseTileDimensions, t = this.baseTileOrigin, s = 0) {
    const { width: r, height: n } = this.getScreenDimensions();
    return {
      x: i.x + r * this.worldOrigin.x,
      y: i.y + n * this.worldOrigin.y,
      z: i.z || 0
    };
  }
  unproject(i, e = { x: 0, y: 0, z: 0 }) {
    return e.x = i.x, e.y = i.y + (i.z || 0), e.z = i.z || 0, e;
  }
  screenUnproject(i, e = { x: 0, y: 0, z: 0 }) {
    const { width: t, height: s } = this.getScreenDimensions();
    return e.x = i.x - t * this.worldOrigin.x, e.y = i.y - s * this.worldOrigin.y + (i.z || 0), e.z = i.z || 0, e;
  }
  getAbsolutePosition(i, e = this.baseTileDimensions, t = this.baseTileOrigin) {
    return {
      x: e.width * i.x,
      y: e.height * i.y,
      z: i.z || 0
    };
  }
}
export {
  P as Tilemap
};
