export interface IPoint {
    x: number;
    y: number;
}
export interface IPoint3 extends IPoint {
    z?: number;
}
export interface IRectangle {
    width: number;
    height: number;
}
export interface IRectangle3 extends IRectangle {
    depth?: number;
}
