import { type ITilemapConfig, Tilemap } from "./Tilemap";
import type { ExtendedBox, IPoint, IPoint3, IRectangle3, MapThree } from "./interfaces";
/**
 * ISOTilemap class configuration, extending ITilemapConfig
 * @date 3/14/2023 - 2:14:31 PM
 *
 * @export
 * @interface IIsoTilemapConfig
 * @typedef {IIsoTilemapConfig}
 * @extends {ITilemapConfig}
 */
export interface IIsoTilemapConfig extends ITilemapConfig {
    /**
     * Isometric projection angle, defaults to `CLASSIC`. Other angles are exported as ISOMETRIC, MILITARY
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @type {?number}
     */
    angle?: number;
    /**
     * It's a good idea to clamp your values to aid performance. In general having values aligned around the 0.5 value will produce a well performing and visually appealing display.
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @type {?boolean}
     */
    clamp?: boolean;
}
/**
 * Class that extends basic 2D Tilemap functionality based on given projectionAngle.
 * @date 3/14/2023 - 2:14:31 PM
 *
 * @export
 * @class IsoTilemap
 * @typedef {IsoTilemap}
 * @template T
 * @extends {Tilemap<T>}
 */
export declare class IsoTilemap<T> extends Tilemap<T> {
    /**
     * Isometric projection angle, defaults to `CLASSIC`. Other angles are exported as ISOMETRIC, MILITARY
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {number}
     */
    protected readonly angle: number;
    /**
     * The cosign of the angle
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {number}
     */
    protected readonly angleCos: number;
    /**
     * The sine of the angle
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {number}
     */
    protected readonly angleSin: number;
    /**
     * Whether or not to clamp values
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {boolean}
     */
    protected readonly clamp: boolean;
    /**
     * The tile offset coordinates given the base dimensions and origin
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {IPoint}
     */
    protected readonly baseOrigin: IPoint;
    /**
     * The height of the top surface of the tile, height - depth
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {number}
     */
    protected readonly baseSurfaceHeight: number;
    /**
     * The middle point of the top surface, (height - depth) / 2
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @protected
     * @readonly
     * @type {number}
     */
    protected readonly baseSurfaceHalfHeight: number;
    /**
     * A three-dimensional map of boxes containing references to tiles, with world coordinations and dimensions of placed tiles
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @readonly
     * @type {MapThree<ExtendedBox<T>>}
     */
    readonly tileDimensions: MapThree<ExtendedBox<T>>;
    /**
     * Creates an instance of IsoTilemap.
     * @date 3/14/2023 - 2:14:31 PM
     *
     * @constructor
     * @param {IIsoTilemapConfig} { angle = CLASSIC, clamp = true, ...config }
     */
    constructor({ angle, clamp, ...config }?: IIsoTilemapConfig);
    protected get baseDepth(): number;
    /**
     * Add a tile to the tilemap at a given coordinate, optionally providing different tile dimensions if the tile is a different size than the base scale.
     * The returned coordinate is relative to the world origin.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {T} v The value to store at provided map coordinates
     * @param {IPoint3} tile The map tile coordinates to store the provided
     * @param {IRectangle3} [dimensions=this.baseTileDimensions] Alternate dimensions to use instead of the base tile dimensions
     * @param {IPoint} [origin=this.baseTileOrigin] Alterate origin with which to place tile if different from base origin
     * @returns {IPoint3} A point at which to place this tile relative to the world origin
     *
     * @example
     *
     *  const T = {}
     *  const { x, y, z } = isoTilemap.add(T, { x: 1, y: 1, z: 0 })
     *  sprite.position.x = x
     *  sprite.position.y = y
     *  sprite.zIndex = z
     *  map.get({ x: 1, y: 1, z: 0 }) === T // true
     */
    add(v: T, tile: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
     * Remove a tile from the given point coordinates.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} point Map coordinates to remove
     * @returns {T} Removed tile, if any
     *
     * @example
     *
     *    const tile = tilemap.remove({ x: 1, y: 1 })
     */
    remove(point: IPoint3): T | undefined;
    /**
     * Project a world coordinate to a tile coordinate, not taking world offset / scale into account.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} point The world coordinates
     * @param {IRectangle3} [dimensions=this.baseTileDimensions] The dimensions of the tile, defaults to `this.baseTileDimensions`
     * @param {IPoint} [origin=this.baseTileOrigin] The origin point of the tile, defaults to `this.baseTileOrigin`
     * @returns {IPoint3} tile coordinate
     *
     * @example
     *
     *  const tileCoord = tileMap.worldToTile(transformGlobalEventToWorldCoordinates({ x: e.offsetX, y: e.offsetY }))
     *  const tileCoord = tileMap.worldToTile({ x: 400, y: 300 })
     */
    worldToTile(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
     * Project a tile coordinate to a world coordinate, not taking world offset / scale into account
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} tile The tile coordinates
     * @param {IRectangle3} [dimensions=this.baseTileDimensions] The dimensions of the tile, defaults to `this.baseTileDimensions`
     * @param {IPoint} [origin=this.baseTileOrigin] The origin point of the tile, defaults to `this.baseTileOrigin`
     * @returns {IPoint3} World space point
     */
    toWorldPoint(tile: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
     *  Get an array of tile dimensions from a map at given x,y coordinates, from ascending z index
     * @date 3/14/2023 - 2:36:28 PM
     *
     * @public
     * @param {IPoint} tile
     * @returns {ExtendedBox<T>[]}
     *
     * @example
     *
     *    const [...boxDimensions] = tilemap.getDimensionsColumn({ x: 1, y: 1 })
     */
    getDimensionsColumn(tile: IPoint): ExtendedBox<T>[];
    /**
     * Return the first visible tile that collides with a projected world coordinate.
     * Starts at highest z and scans tiles along a ray to the lowest z.
     * Optionally takes a callback with the backing value and tile coordinates to include in the ray's path
     *
     * @date 3/14/2023 - 2:14:30 PM
     *
     * @public
     * @param {IPoint} point
     * @param {?(t: T) => boolean} [include]
     * @returns {(T | undefined)}
     *
     * @example
     *
     *  const foo = map.add('foo', { x: 0, y: 0, z: 0 })
     *  const bar = map.add('bar', { x: 1, y: 1, z: 1 })
     *  castRay({ x: 400, y: 400 }) === bar
     */
    castRay(point: IPoint3, include?: (t: T, tile: IPoint3) => boolean): T | undefined;
    /**
     * Returns a three-dimensional map of all tiles that collide with a projected world coordinate
     * Optionally takes a callback with the backing value and tile coordinates to include in the ray's path
     *
     * @date 3/14/2023 - 2:14:30 PM
     *
     * @public
     * @param {IPoint} point
     * @param {?(t: T) => boolean} [include]
     * @returns {MapThree<T>}
     *
     *  @example
     *
     *  const foo = map.add('foo', { x: 0, y: 0, z: 0 })
     *  const bar = map.add('bar', { x: 1, y: 1, z: 1 })
     *  hits({ x: 400, y: 400 }) === Map{ 0: Map{ 0: Map{ 0: foo } }, 1: Map{ 1: Map{ 1: bar } } }
     */
    collisionMap(point: IPoint3, include?: (t: T, tile: IPoint3) => boolean): MapThree<T>;
    project(p: IPoint3, dimensions?: IRectangle3, origin?: IPoint, depth?: number): IPoint3;
    screenProject(p: IPoint3, dimensions?: IRectangle3, origin?: IPoint, depth?: number): IPoint3;
    unproject(point: IPoint3, out?: IPoint3): IPoint3;
    screenUnproject(point: IPoint3, out?: IPoint3): IPoint3;
    getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
//# sourceMappingURL=IsoTilemap.d.ts.map