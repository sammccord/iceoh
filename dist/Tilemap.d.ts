import { IPoint3, IPoint, IRectangle, IRectangle3 } from './interfaces';
export interface ITilemapConfig {
    worldOrigin?: IPoint;
    baseTileOrigin?: IPoint;
    baseTileDimensions: IRectangle3;
    getGlobalDimensions: () => IRectangle;
    getWorldPosition: () => IPoint;
    getWorldScale: () => IPoint;
}
export declare class Tilemap<T> {
    protected getGlobalDimensions: () => IRectangle;
    protected getWorldPosition: () => IPoint;
    protected getWorldScale: () => IPoint;
    protected baseTileDimensions: IRectangle3;
    protected readonly worldOrigin: IPoint;
    protected readonly baseTileOrigin: IPoint;
    protected readonly tiles: T[];
    protected readonly map: {
        [layer: number]: {
            [row: number]: {
                [col: number]: T;
            };
        };
    };
    constructor({ worldOrigin, baseTileOrigin, baseTileDimensions, getGlobalDimensions, getWorldPosition, getWorldScale }: ITilemapConfig);
    add(sprite: T, point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    get(point: IPoint3): T;
    getColumn<C>(point: IPoint3, map?: {}): C[];
    move(from: IPoint3, to: IPoint3, dimensions?: IRectangle, origin?: IPoint): IPoint3;
    remove(point: IPoint3): T;
    toPoint(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    toTile(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    centerToTile(point: IPoint): IPoint;
    centerToPoint(point: IPoint): IPoint;
    get centerTile(): IPoint;
    center(): IPoint;
    getBounds(): IPoint & IRectangle3;
    _project(point3: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    _unproject(point: IPoint3, out?: IPoint3): IPoint3;
    _getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
