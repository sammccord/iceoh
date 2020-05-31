import { IPoint3, IPoint, IRectangle3 } from './interfaces';
import { Tilemap, ITilemapConfig } from './Tilemap';
/**
 * Object extending `ITilemapConfig` with optional projectionAngle, defaulting to `CLASSIC`
 */
export interface IIsoTilemapConfig extends ITilemapConfig {
    /** Isometric projection angle, defaults to `CLASSIC` */
    projectionAngle?: number;
}
/**
 * Class that extends basic 2D Tilemap functionality based on given projectionAngle.
 * @param {T} - The type of sprite object to store
 * @extends Tilemap
 */
export declare class IsoTilemap<T> extends Tilemap<T> {
    protected readonly transform: [number, number];
    protected readonly baseOrigin: IPoint;
    protected readonly baseSurfaceHeight: number;
    protected readonly baseSurfaceHalfHeight: number;
    readonly depthMap: {
        [z: number]: {
            [x: number]: {
                [y: number]: number;
            };
        };
    };
    /**
    * Create an `IsoTilemap<T>` instance.
    * @param {IIsoTilemapConfig} config - projectionAngle will default to CLASSIC
    */
    constructor({ projectionAngle, ...config }: IIsoTilemapConfig);
    /**
    * Add tile to the tilemap at given coordinate.
    * If given tile is tall enough to occupy multiple z-layers at the base tile depth, it will add a reference at those z-layers in the map.
    * @param {T} tile
    * @param {IPoint3} point - The map coordinates at which to store this tile
    * @param {IRectangle3=} dimensions - The dimensions of the tile, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile, defaults to `this.baseTileOrigin`
    * @return {IPoint3} A 3D Point at which to place this tile in screen space
    *
    * @example
    *
    *    const position = isoTilemap.add({}, { x: 1, y: 1, z: 0 })
    */
    add(sprite: T, point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
    * Remove a tile from the given point coordinates.
    * If the tile exists at multiple z-layers, it'll remove references to the tile at those layers as well.
    * @param {IPoint3} point - The map coordinates from which to remove a tile
    * @return {[T]} The tile that existed at the given point, or null if there was no tile.
    *
    * @example
    *
    *    const removedTile = isoTilemap.remove({ x: 1, y: 1, z: 0 })
    */
    remove(point: IPoint3): T;
    /**
    * Project a screen point to tile point
    * @param {IPoint3} point - The screen coordinates to project
    * @param {IRectangle3=} dimensions - The dimensions of each tile on the map, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile
    * @return {IPoint3} The tile coordinate in the map
    *
    * @example
    *
    *    const tilePosition = isoTilemap.toTile({ x: 400, y: 300 })
    */
    toTile(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    protected _project(point3: IPoint3, dimensions?: IRectangle3, origin?: IPoint, depth?: number): IPoint3;
    protected _unproject(point: IPoint3, out?: IPoint3): IPoint3;
    protected _getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
