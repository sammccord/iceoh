import { IPoint, IPoint3, MapThree } from "./interfaces";

/**
 * Classic projection found in most games
 * @date 3/14/2023 - 12:21:46 PM
 *
 * @export
 * @type {number}
 */
export const CLASSIC = Math.atan(0.5);

/**
 * Isometric projection
 * @date 3/14/2023 - 12:23:04 PM
 *
 * @export
 * @type {number}
 */
export const ISOMETRIC = Math.PI / 6;

/**
 * Military projection
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {number}
 */
export const MILITARY = Math.PI / 4;

/**
 * Point specifying top left placement factor
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export const TOP_LEFT: IPoint = { x: 0, y: 0 };

/**
 * Point specifying middle placement factor
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export const MIDDLE: IPoint = { x: 0.5, y: 0.5 };

/**
 * Point specifying a factor of 1 for both axes
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export const FULL: IPoint = { x: 1, y: 1 };

/**
 * Enum specifying compass directions, including NONE
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @enum {DIRECTION}
 */
export enum DIRECTION {
  NONE = "NONE",
  N = "N",
  NE = "NE",
  E = "E",
  SE = "SE",
  S = "S",
  SW = "SW",
  W = "W",
  NW = "NW",
}

/**
 * Given a three-dimensional map, return a one dimensional array sorted by ascending z -> x -> y containing values at those paths
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @template T
 * @param {MapThree<T>} grids
 * @returns {T[]}
 *
 * @example
 *
 *  const [furthest, middle, ...etc, closest] = collectRay(3dmap)
 */
export function collectRay<T>(grids: MapThree<T>): T[] {
  const entries: T[] = [];
  for (const z of Array.from(grids.keys()).sort()) {
    const zPlane = grids.get(z);
    for (const x of Array.from(zPlane.keys()).sort()) {
      const xPlane = zPlane.get(x);
      for (const y of Array.from(xPlane.keys()).sort()) {
        entries.push(xPlane.get(y));
      }
    }
  }
  return entries;
}

/**
 * Deeply set a value in object at given indices using maps for new path creation
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @template T
 * @param {Map<number, any>} obj
 * @param {number[]} indices
 * @param {T} value
 * @returns {T}
 *
 * @example
 *
 *  const tile = set(new Map(), [0, 1, 2], sprite)
 */
export function set<T>(obj: Map<number, any>, indices: number[], value: T): T {
  let o = obj;
  while (indices.length - 1) {
    var n = indices.shift();
    let v = o.get(n);
    if (!v) {
      const m = new Map();
      o.set(n, m);
      o = m;
    } else {
      o = v;
    }
  }
  o.set(indices[0], value);
  return value;
}

/**
 * Deeply get a value from a map at given indicies path.
 * If `setIfNull` is provided, new maps will be used for path creation and the value will be set.
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @template T
 * @param {Map<number, any>} map
 * @param {number[]} indices
 * @param {?T} [setIfNull]
 * @returns {T}
 *
 * @example
 *
 *  const tile = get(new Map(), [0, 1, 2], sprite)
 */
export function get<T>(
  map: Map<number, any>,
  indices: number[],
  setIfNull?: T
): T {
  var o = map;
  while (indices.length) {
    var n = indices.shift();
    let v = o.get(n);
    if (!v) {
      if (setIfNull && !indices.length) {
        o.set(n, setIfNull);
        return setIfNull;
      } else if (setIfNull) {
        v = new Map();
        o.set(n, v);
      } else {
        return;
      }
    }
    o = v;
  }
  return o as T;
}

/**
 * Get a value from a three-dimensional map with a point
 * @date 3/14/2023 - 12:35:21 PM
 *
 * @export
 * @template T
 * @param {MapThree<T>} map
 * @param {IPoint3} point
 * @returns {T}
 *
 * @example
 *
 *  const v = pointGet(mapThree, { x: 1, y: 1, z: 1 })
 */
export function pointGet<T>(map: MapThree<T>, point: IPoint3): T {
  return get<T>(map, [point.z || 0, point.x, point.y]);
}

/**
 * Deeply remove a value in map at given indices
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @param {Map<number, any>} obj
 * @param {number[]} indices
 * @returns {boolean}
 *
 * @example
 *
 *  const removed = remove(new Map(), [0, 1, 2])
 */
export function remove(obj: Map<number, any>, indices: number[]): boolean {
  let o = obj;
  while (indices.length - 1) {
    var n = indices.shift();
    let v = o.get(n);
    if (!v) return false;
    else o = v;
  }
  return o.delete(indices[0]);
}

/**
 * Retrieves distance between two 2d points
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @param {IPoint} from
 * @param {IPoint} to
 * @returns {number}
 *
 * @example
 *
 *  const dist = getDistance({ x: 5, y: 5 }, { x: 10, y: 10 })
 */
export function getDistance(from: IPoint, to: IPoint): number {
  return Math.sqrt(
    (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
  );
}

/**
 * Sums an array of numbers, ignoring null and undefined
 * @date 3/14/2023 - 12:28:23 PM
 *
 * @export
 * @param {(number | null | undefined)[]} numbers
 * @returns {number}
 *
 * @example
 *  const total = sum([ 1, 10, null, 5 ])
 */
export function sum(numbers: (number | null | undefined)[]): number {
  return numbers.reduce((s, n) => (!!n ? s + n : s), 0);
}

const ZERO = 0;

/**
 * Gets compass direction between two points
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @param {IPoint3} from
 * @param {IPoint3} to
 * @returns {DIRECTION}
 *
 * @example
 *
 *  getDirection({ x: 1, y: 1 }, { x: 1: y: 0 }) === DIRECTION.N
 */
export function getDirection(from: IPoint3, to: IPoint3): DIRECTION {
  let diffX = to.x - from.x,
    diffY = to.y - from.y;
  if (diffX === ZERO && diffY < ZERO) return DIRECTION.N;
  if (diffX > ZERO && diffY < ZERO) return DIRECTION.NE;
  if (diffX > ZERO && diffY === ZERO) return DIRECTION.E;
  if (diffX > ZERO && diffY > ZERO) return DIRECTION.SE;
  if (diffX === ZERO && diffY > ZERO) return DIRECTION.S;
  if (diffX < ZERO && diffY > ZERO) return DIRECTION.SW;
  if (diffX < ZERO && diffY === ZERO) return DIRECTION.W;
  if (diffX < ZERO && diffY < ZERO) return DIRECTION.NW;
  return DIRECTION.NONE;
}
