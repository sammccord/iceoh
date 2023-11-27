import type { IBox, IPoint, IPoint3, IRectangle, IRectangle3, MapThree, TileIterator } from "./interfaces";
/**
 * Base Tilemap class configuration
 * @date 3/14/2023 - 12:44:55 PM
 *
 * @export
 * @interface ITilemapConfig
 * @typedef {ITilemapConfig}
 */
export interface ITilemapConfig {
    /**
     * The screen offset for the 0,0 tile coordinate, defaults to 'MIDDLE'
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {?IPoint}
     */
    worldOrigin?: IPoint;
    /**
     * The anchor point at which tiles are expected to be drawn to screen, defaults to `MIDDLE`
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {?IPoint}
     */
    baseTileOrigin?: IPoint;
    /**
     * The base dimensions of tiles that comprise the map.
     * In 2D Tilemaps this would ideally be squares, `{ x: 32, y: 32 }`.
     * Isometric tilemaps expect a depth field to correctly place tiles at z > 0
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {IRectangle3}
     */
    baseTileDimensions?: IRectangle3;
    /**
     * A getter function that retuns the screen dimensions of the canvas
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {() => IRectangle}
     *
     * @example
     *
     *  getScreenDimensions: () => { width: 400, height: 400 }
     */
    getScreenDimensions?: () => IRectangle;
    /**
     * A getter function that returns the world offset, this defaults to `() => { x: 0, y: 0 }`
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {?() => IPoint}
     *
     * @example
     *
     *  const world = new PIXI.Container()
     *  getWorldPosition: () => world.position
     */
    getWorldPosition?: () => IPoint;
    /**
     * A getter function that returns the world scale, this defaults to `() => { x: 1, y: 1 }`
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @type {?() => IPoint}
     *
     * @example
     *
     *  const world = new PIXI.Container()
     *  getWorldPosition: () => world.scale
     *
     */
    getWorldScale?: () => IPoint;
}
/**
 * Description placeholder
 * @date 3/14/2023 - 12:44:55 PM
 *
 * @export
 * @class Tilemap
 * @typedef {Tilemap}
 * @template T
 */
export declare class Tilemap<T> {
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @type {() => IRectangle}
     */
    protected getScreenDimensions: () => IRectangle;
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @type {() => IPoint}
     */
    protected getWorldPosition: () => IPoint;
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @type {() => IPoint}
     */
    protected getWorldScale: () => IPoint;
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @type {IRectangle3}
     */
    protected baseTileDimensions: IRectangle3;
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @readonly
     * @type {IPoint}
     */
    protected readonly worldOrigin: IPoint;
    /**
     * Description placeholder
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @readonly
     * @type {IPoint}
     */
    protected readonly baseTileOrigin: IPoint;
    /**
     * Contains references to T values using their tile coordinates for three-dimensional map indices, z -> x -> y
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @readonly
     * @type {MapThree<T>}
     */
    protected readonly map: MapThree<T>;
    /**
     * Contains the lower and upper bounds of the map's z, x, y axes using tile coordinates
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @readonly
     * @type {{ x: { min: number; max: number; }; y: { min: number; max: number; }; z: { min: number; max: number; }; }}
     */
    protected readonly bounds: {
        x: {
            min: number;
            max: number;
        };
        y: {
            min: number;
            max: number;
        };
        z: {
            min: number;
            max: number;
        };
    };
    /**
     * Create a `Tilemap<T>` instance.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @constructor
     * @param {ITilemapConfig} {
        worldOrigin,
        baseTileOrigin,
        baseTileDimensions,
        getScreenDimensions,
        getWorldPosition,
        getWorldScale,
      }
     */
    constructor({ worldOrigin, baseTileOrigin, baseTileDimensions, getScreenDimensions, getWorldPosition, getWorldScale, }?: ITilemapConfig);
    /**
     * Add a tile to the tilemap at a given coordinate, optionally providing different tile dimensions if the tile is a different size than the base scale.
     * The returned coordinate is relative to the world origin.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {T} t The value to store at provided map coordinates
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
    add(t: T, tile: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
     * Add many tiles, returning world points for each.
     * @date 11/26/2023 - 7:37:07 PM
     *
     * @public
     * @param {[T, IPoint3][]} tiles
     * @param {IRectangle3} [dimensions=this.baseTileDimensions]
     * @param {IPoint} [origin=this.baseTileOrigin]
     * @returns {*}
     */
    addMany(tiles: [T, IPoint3][], dimensions?: IRectangle3, origin?: IPoint): IPoint3[];
    /**
     * Will set a tile in the map without projecting coordinates
     * @date 11/26/2023 - 7:33:05 PM
     *
     * @public
     * @param {T} t
     * @param {IPoint3} p
     */
    set(t: T, p: IPoint3): void;
    /**
     * Set many points
     * @date 11/26/2023 - 7:34:19 PM
     *
     * @public
     * @param {[T, IPoint3][]} tiles
     */
    setMany(tiles: [T, IPoint3][]): void;
    /**
     * Get a single tile at given map coordinates
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} point Map tile coordinates. If no z is provided, it defaults to 0.
     * @returns {T} The tile at given coordinates
     *
     * @example
     *
     *    const tile = tilemap.get({ x: 1, y: 1, z: 1 })
     */
    get(point: IPoint3): T | undefined;
    /**
     * Get an array of values from a map at given x,y coordinates, from ascending z index
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @template C
     * @param {IPoint} point Map coordinates to get at each z-layer
     * @param {?MapThree<T>} [map] Map to search against, defaults to `this.map`
     * @returns {C[]}
     *
     * @example
     *
     *    const [z0Tile, z1Tile, z2Tile] = tilemap.getColumn({ x: 1, y: 1, z: 1 })
     */
    getColumn<C = T>(point: IPoint, map?: MapThree<C>): C[];
    /**
     * Moves a tile from given coordinate to another coordinate
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} from The map coordinates of the tile to move
     * @param {IPoint3} to The map coordinates to move the tile to
     * @param {IRectangle} [dimensions=this.baseTileDimensions] The dimensions of the tile, defaults to `this.baseTileDimensions`
     * @param {IPoint} [origin=this.baseTileOrigin] The origin point of the tile, defaults to `this.baseTileOrigin`
     * @returns {IPoint3} A point at which to place the moved tile relative to the world origin
     *
     * @example
     *
     *    const { x, y, z } = tilemap.move({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 0 })
     *    sprite.position.x = x
     *    sprite.position.y = y
     *    sprite.zIndex = z
     */
    move(from: IPoint3, to: IPoint3, dimensions?: IRectangle, origin?: IPoint, fallback?: T): IPoint3 | undefined;
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
     * Project a tile coordinate to an absolute screen space coordinate relative to the window, taking world offset / scale into account
     *
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} tile The tile coordinates
     * @param {IRectangle3} [dimensions=this.baseTileDimensions] The dimensions of the tile, defaults to `this.baseTileDimensions`
     * @param {IPoint} [origin=this.baseTileOrigin] The origin point of the tile, defaults to `this.baseTileOrigin`
     * @returns {IPoint3} Screen space point
     *
     * @example
     *
     *  const { x, y } = map.toScreenPoint({ x: 0, y: 0, z: 0 });
     *  debugGraphics.lineStyle(2, 0xff00ff, 1);
     *  debugGraphics.drawRect(
     *    x - 32 * mapContainer.scale.x,
     *    y - 32 * mapContainer.scale.y,
     *    64 * mapContainer.scale.x,
     *    32 * mapContainer.scale.y
     *  );
     */
    toScreenPoint(tile: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
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
     * Returns the new world position where the given tile is in the center of the viewport.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint3} tile The tile coordinates to center
     * @returns {IPoint}
     *
     * @example
     *
     *    const mapContainer = new PIXI.Container()
     *    const worldPosition = tilemap.centerToTile({ x: 1, y: 1, z: 0 })
     *    mapContainer.x = worldPosition.x
     *    mapCOntainer.y = worldPosition.y
     */
    centerToTile(tile: IPoint3): IPoint;
    /**
     * Returns a world offset position where the given screen space coordinate is centered to the viewport
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @param {IPoint} point
     * @returns {IPoint}
     *
     * @example
     *
     *    const mapContainer = new PIXI.Container()
     *    const worldPosition = tilemap.centerToPoint({ x: 500, y: 200 })
     *    mapContainer.x = worldPosition.x
     *    mapCOntainer.y = worldPosition.y
     */
    centerToPoint(point: IPoint): IPoint;
    /**
     * Calculates the current map bounds and returns the tile coordinates in the center
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @readonly
     * @type {IPoint}
     */
    get centerTile(): IPoint;
    /**
     * Returns a world offset position where the centermost tile is centered to the viewport
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @returns {IPoint}
     *
     * @example
     *
     *    const mapContainer = new PIXI.Container()
     *    const worldPosition = tilemap.center()
     *    mapContainer.x = worldPosition.x
     *    mapCOntainer.y = worldPosition.y
     */
    center(): IPoint;
    /**
     * Calculates the map bounds of the current tilemap.
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @public
     * @returns {IBox}
     *
     * @example
     *
     *    const { x, y, width, height, depth } = tilemap.getBounds()
     */
    getBounds(): IBox;
    each(iterator: TileIterator<T>): void;
    within(floor: IPoint3, ceil: IPoint3, iterator: TileIterator<T | undefined>): void;
    neighbors(point: IPoint3, iterator: TileIterator<T | undefined>): void;
    around(point: IPoint3, radius: number, traverse: TileIterator<T | undefined>, iterator: TileIterator<T | undefined>): void;
    /**
     * Recalculate bounds given a new point modifying the floors and ceilings of all axes
     * @date 3/14/2023 - 12:44:55 PM
     *
     * @protected
     * @param {IPoint3} point
     *
     * @example
     *
     *    tilemap.recalculateBounds({ x: 1, y: 1, z: -1 })
     */
    protected recalculateBounds(point: IPoint3): void;
    protected _project(point3: IPoint3, dimensions?: IRectangle3, origin?: IPoint, depth?: number): IPoint3;
    protected _unproject(point: IPoint3, out?: IPoint3): IPoint3;
    protected _getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
//# sourceMappingURL=Tilemap.d.ts.map