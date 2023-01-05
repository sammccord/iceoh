import { IPoint, IPoint3 } from "./interfaces";

/**
 * Classic 2:1 projection angle found in most isometric games
 *
 * @type {number}
 */
export const CLASSIC = Math.atan(0.5);
/**
 * Isometric projection
 *
 * @type {number}
 */
export const ISOMETRIC = Math.PI / 6;
/**
 * Military projection
 *
 * @type {number}
 */
export const MILITARY = Math.PI / 4;

/**
 * Point specifying top left placement factor
 *
 * @type {IPoint}
 */
export const TOP_LEFT: IPoint = { x: 0, y: 0 };

/**
 * Point specifying middle placement factor
 *
 * @type {IPoint}
 */
export const MIDDLE: IPoint = { x: 0.5, y: 0.5 };

/**
 * Point specifying a factor of 1 for both axes
 *
 * @type {IPoint}
 */
export const FULL: IPoint = { x: 1, y: 1 };

/**
 * Enum specifying compass directions, including NONE
 *
 * @type {DIRECTION}
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
 * Deeply set a value in object at given indices using maps for new path creation
 *
 * @param {object} obj - Object to deeply set
 * @param {number[]} indices - Array of keys to set
 * @param {any} value - The value to set
 * @return {any} The value set
 *
 * @example
 *
 *    const tile = set(new Map(), [0, 1, 2], sprite)
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
 *
 * @param {object} obj - Object to deeply get
 * @param {number[]} indices - Array of keys to get
 * @param {any} [setIfNull] - The value to set, if any
 * @return {any} The value at given indices
 *
 * @example
 *
 *    const tile = get(new Map(), [0, 1, 2], sprite)
 */
export function get<T>(
  obj: Map<number, any>,
  indices: number[],
  setIfNull?: T
): T {
  var o = obj;
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
 * Deeply remove a value in map at given indices
 *
 * @param {object} obj - Object to deeply set
 * @param {number[]} indices - Array of keys to set
 * @return {boolean} true if an element in the Map existed and has been removed, or false if the element does not exist.
 *
 * @example
 *
 *    const removed = remove(new Map(), [0, 1, 2])
 */
export function remove<T>(obj: Map<number, any>, indices: number[]): boolean {
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
 * Gets distance between two 2D Points
 *
 * @param {IPoint} from
 * @param {IPoint} to
 * @return {number} Distance
 *
 * @example
 *
 *    const tile = getDistance({ x: 5, y: 5 }, { x: 10, y: 10 })
 */
export function getDistance(from: IPoint, to: IPoint): number {
  return Math.sqrt(
    (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
  );
}

/**
 * Sums an array of numbers, ignoring null values
 *
 * @param {number[]} numbers
 * @return {number} sum
 *
 * @example
 *
 *    const total = sum([ 1, 10, null, 5 ])
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((s, n) => (!!n ? s + n : s), 0);
}

const ZERO = 0;
/**
 * Gets compass direction between two points
 *
 * @param {IPoint} from
 * @param {IPoint} to
 * @return {DIRECTION}
 *
 * @example
 *
 *    const direction = getDirection({ x: 1, y: 1 }, { x: 1: y: 0 }) // DIRECTION.N
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
