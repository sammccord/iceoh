import { IPoint, IPoint3 } from "./interfaces";
export declare const CLASSIC: number;
export declare const ISOMETRIC: number;
export declare const MILITARY: number;
export declare const TOP_LEFT: IPoint;
export declare const MIDDLE: IPoint;
export declare const ZERO = 0;
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
export declare function set<T>(obj: {}, indices: number[], value: T): T;
export declare function get<T>(obj: {}, indices: number[], setIfNull?: T): T;
export declare function getDistance(p1: IPoint, p2: IPoint): number;
export declare function sum(numbers: number[]): number;
export declare function getIsoDirection(from: IPoint3, to: IPoint3): DIRECTION;
