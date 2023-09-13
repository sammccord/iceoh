import type { IPoint, IPoint3, MapThree } from "./interfaces";
/**
 * Classic projection found in most games
 * @date 3/14/2023 - 12:21:46 PM
 *
 * @export
 * @type {number}
 */
export declare const CLASSIC: number;
/**
 * Isometric projection
 * @date 3/14/2023 - 12:23:04 PM
 *
 * @export
 * @type {number}
 */
export declare const ISOMETRIC: number;
/**
 * Military projection
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {number}
 */
export declare const MILITARY: number;
/**
 * Point specifying top left placement factor
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export declare const TOP_LEFT: IPoint;
/**
 * Point specifying middle placement factor
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export declare const MIDDLE: IPoint;
/**
 * Point specifying a factor of 1 for both axes
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @type {IPoint}
 */
export declare const FULL: IPoint;
/**
 * Enum specifying compass directions, including NONE
 * @date 3/14/2023 - 12:23:06 PM
 *
 * @export
 * @enum {DIRECTION}
 */
export declare enum DIRECTION {
    NONE = "NONE",
    N = "N",
    NE = "NE",
    E = "E",
    SE = "SE",
    S = "S",
    SW = "SW",
    W = "W",
    NW = "NW"
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
export declare function collectRay<T>(grids: MapThree<T>): T[];
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
export declare function set<T>(obj: Map<number, any>, indices: number[], value: T): T;
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
export declare function get<T>(map: Map<number, any>, indices: number[], setIfNull?: T): T | undefined;
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
export declare function pointGet<T>(map: MapThree<T>, point: IPoint3): T | undefined;
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
export declare function remove(obj: Map<number, any>, indices: number[]): boolean;
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
export declare function getDistance(from: IPoint, to: IPoint): number;
/**
 * Returns the 2D center of a list of points. This value is not rounded and can be floating point.
 * @date 4/12/2023 - 9:01:37 AM
 *
 * @export
 * @param {IPoint[]} points
 * @returns {IPoint}
 */
export declare function getCenter(points: IPoint[]): IPoint;
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
export declare function sum(numbers: (number | null | undefined)[]): number;
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
export declare function getDirection(from: IPoint3, to: IPoint3): DIRECTION;
