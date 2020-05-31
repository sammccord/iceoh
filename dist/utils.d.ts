import { IPoint, IPoint3 } from "./interfaces";
/**
 * Classic 2:1 projection angle found in most isometric games
 *
 * @type {number}
 */
export declare const CLASSIC: number;
/**
 * Isometric projection
 *
 * @type {number}
 */
export declare const ISOMETRIC: number;
/**
 * Military projection
 *
 * @type {number}
 */
export declare const MILITARY: number;
/**
 * Point specifying top left placement factor
 *
 * @type {IPoint}
 */
export declare const TOP_LEFT: IPoint;
/**
 * Point specifying middle placement factor
 *
 * @type {IPoint}
 */
export declare const MIDDLE: IPoint;
/**
 * Point specifying a factor of 1 for both axes
 *
 * @type {IPoint}
 */
export declare const FULL: IPoint;
/**
 * Enum specifying compass directions, including NONE
 *
 * @type {DIRECTION}
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
 * Deeply set a value in object at given indices using objects for new path creation
 *
 * @param {object} obj - Object to deeply set
 * @param {number[]} indices - Array of keys to set
 * @param {any} value - The value to set
 * @return {any} The value set
 *
 * @example
 *
 *    const tile = set({}, [0, 1, 2], sprite)
 */
export declare function set<T>(obj: {}, indices: number[], value: T): T;
/**
 * Deeply get a value from an object at given indicies path.
 * If `setIfNull` is provided, new objects will be used for path creation and the value will be set.
 *
 * @param {object} obj - Object to deeply get
 * @param {number[]} indices - Array of keys to get
 * @param {any} [setIfNull] - The value to set, if any
 * @return {any} The value at given indices
 *
 * @example
 *
 *    const tile = get({}, [0, 1, 2], sprite)
 */
export declare function get<T>(obj: {}, indices: number[], setIfNull?: T): T;
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
export declare function getDistance(from: IPoint, to: IPoint): number;
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
export declare function sum(numbers: number[]): number;
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
export declare function getDirection(from: IPoint3, to: IPoint3): DIRECTION;
