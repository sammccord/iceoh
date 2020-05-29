import { IPoint3, IPoint, IRectangle3 } from './interfaces';
import { Tilemap, ITilemapConfig } from './Tilemap';
export interface IIsoTilemapConfig {
    projectionAngle?: number;
}
export declare class IsoTilemap<T> extends Tilemap<T> {
    protected readonly transform: [number, number];
    protected readonly baseOrigin: IPoint;
    protected readonly baseSurfaceHeight: number;
    protected readonly baseSurfaceHalfHeight: number;
    readonly depthMap: {
        [layer: number]: {
            [row: number]: {
                [col: number]: number;
            };
        };
    };
    constructor({ projectionAngle, ...config }: IIsoTilemapConfig & ITilemapConfig);
    add(sprite: T, point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    remove(point: IPoint3): T;
    toTile(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    _project(point3: IPoint3, dimensions?: IRectangle3, origin?: IPoint, depth?: number): IPoint3;
    _unproject(point: IPoint3, out?: IPoint3): IPoint3;
    _getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
