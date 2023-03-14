/**
 * A three dimensional map ordered Map<z, Map<x, Map<y, T>>>.
 * @date 3/14/2023 - 12:09:05 PM
 *
 * @export
 * @typedef {MapThree}
 * @template T
 */
export type MapThree<T> = Map<number, Map<number, Map<number, T>>>;

/**
 * A two-dimensional point in space.
 * @date 3/14/2023 - 12:10:01 PM
 *
 * @export
 * @interface IPoint
 * @typedef {IPoint}
 */
export interface IPoint {
  x: number;
  y: number;
}

/**
 * A three-dimensional point in space. Z is optional and will default to 0 if undefined.
 * @date 3/14/2023 - 12:10:22 PM
 *
 * @export
 * @interface IPoint3
 * @typedef {IPoint3}
 * @extends {IPoint}
 */
export interface IPoint3 extends IPoint {
  z?: number;
}

/**
 * A rectangle with a width and height.
 * @date 3/14/2023 - 12:11:00 PM
 *
 * @export
 * @interface IRectangle
 * @typedef {IRectangle}
 */
export interface IRectangle {
  width: number;
  height: number;
}

/**
 * A three-dimensional rectangle with an optional depth that will default to 1 if undefined.
 * @date 3/14/2023 - 12:11:23 PM
 *
 * @export
 * @interface IRectangle3
 * @typedef {IRectangle3}
 * @extends {IRectangle}
 */
export interface IRectangle3 extends IRectangle {
  depth?: number;
}

/**
 * A box is a three-dimensional rectangle with spatial coordinates
 * @date 3/14/2023 - 12:12:21 PM
 *
 * @export
 * @typedef {IBox}
 */
export type IBox = IRectangle3 & IPoint3;

/**
 * A box that is context aware with its tile coordinates and storage value, used for hit scan operations
 * @date 3/14/2023 - 12:13:56 PM
 *
 * @export
 * @typedef {ExtendedBox}
 * @template T
 */
export type ExtendedBox<T> = IBox & {
  value: T;
  tile: IPoint3;
  origin: IPoint;
};
