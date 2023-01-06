export type MapThree<T> = Map<number, Map<number, Map<number, T>>>;

/**
 * 2D Point
 */
export interface IPoint {
  x: number;
  y: number;
}

/**
 * 3D Point witn optional z. Z will default to 0 in Tilemap methpds.
 */
export interface IPoint3 extends IPoint {
  z?: number;
}

/**
 * Specifies a width and height
 */
export interface IRectangle {
  width: number;
  height: number;
}

/**
 * Extends IRectangle with optional depth. Depth will default to 1 in Tilemap methods.
 */
export interface IRectangle3 extends IRectangle {
  depth?: number;
}

/**
 * Extends IRectangle3 with a 2D coordinate
 */
export type IBox = IRectangle3 & IPoint;
