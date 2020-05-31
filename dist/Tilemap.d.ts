import { IPoint3, IPoint, IRectangle, IRectangle3, IBox } from './interfaces';
/**
 * Tilemap configuration
 */
export interface ITilemapConfig {
    /** The screen offset for the 0,0 coordinate, deaults to `MIDDLE` */
    worldOrigin?: IPoint;
    /** The anchor point at which tiles are expected to be drawn to screen, defaults to `MIDDLE` */
    baseTileOrigin?: IPoint;
    /**
     * The base dimensions of tiles that comprise the map.
     * In 2D Tilemaps this would ideally be squares, `{ x: 32, y: 32 }`.
     * Isometric tilemaps expect a depth field to correctly place tiles at z > 0
     */
    baseTileDimensions: IRectangle3;
    /** A getter function that retuns the dimensions of the canvas */
    getGlobalDimensions: () => IRectangle;
    /** A getter function that returns the world offset, this defaults to `() => { x: 0, y: 0 }` */
    getWorldPosition?: () => IPoint;
    /** A getter function that returns the world scale, this defaults to `() => { x: 1, y: 1 }` */
    getWorldScale?: () => IPoint;
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
        [z: number]: {
            [x: number]: {
                [y: number]: T;
            };
        };
    };
    /**
    * Create a `Tilemap<T>` instance.
    * @param {ITilemapConfig} config
    */
    constructor({ worldOrigin, baseTileOrigin, baseTileDimensions, getGlobalDimensions, getWorldPosition, getWorldScale }: ITilemapConfig);
    /**
    * Add tile to the tilemap at given coordinate.
    * @param {T} tile
    * @param {IPoint3} point - The map coordinates at which to store this tile
    * @param {IRectangle3=} dimensions - The dimensions of the tile tile, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile
    * @return {IPoint3} A point at which to place this tile in screen space
    *
    * @example
    *
    *    const position = isoTilemap.add({}, { x: 1, y: 1, z: 0 })
    */
    add(sprite: T, point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
   * Get a tile at given map coordinates
   *
   * @param {IPoint3} point - Tile to get at given coordinates. If no z is provided, it defaults to 0.
   * @return {T} The tile at given coordinates
   *
   * @example
   *
   *    const tile = tilemap.get({ x: 1, y: 1, z: 1 })
   */
    get(point: IPoint3): T;
    /**
    * Get an array of values from a map at given x,y coordinates.
    *
    * @param {IPoint} point - Map coordinates to get at each z-layer
    * @param {object=} map - Object to search against, defaults to `this.map`, but will also work if called with `this.depthMap`, in which case numerical tile depths are returned.
    * @return {T[]} Array of values at given x,y coordinates. If the map is multiple z-layers deep, but the tile x,y coordinate doesn't exist in all layers, the returned array will contain null entries.
    *
    * @example
    *
    *    const tiles = tilemap.getColumn({ x: 1, y: 1 })
    *    const depths = tilemap.getColumn({ x: 1, y: ! }, tilemap.depthMap)
    */
    getColumn<C>(point: IPoint, map?: {}): C[];
    /**
    * Moves a tile from given coordinate to another coordinate
    * @param {IPoint3} from - The map coordinates of the tile to move
    * @param {IPoint3} to - The map coordinates to move the tile to
    * @param {IRectangle3=} dimensions - The dimensions of the tile, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile, defaults to `this.baseTileOrigin`
    * @return {IPoint3} A point at which to place this tile in screen space
    *
    * @example
    *
    *    const position = tilemap.move({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 0 })
    */
    move(from: IPoint3, to: IPoint3, dimensions?: IRectangle, origin?: IPoint): IPoint3;
    /**
    * Remove a tile from the given point coordinates.
    *
    * @param {IPoint3} point - Map coordinates to remove
    * @return {[T]} The removed tile if found
    *
    * @example
    *
    *    const tile = tilemap.remove({ x: 1, y: 1 })
    */
    remove(point: IPoint3): T;
    /**
    * Project a tile coordinate to screen space coordinate
    * @param {IPoint3} point - The tile coordinates
    * @param {IRectangle3=} dimensions - The dimensions of the tile, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile, defaults to `this.baseTileOrigin`
    * @return {IPoint3} Screen space point
    *
    * @example
    *
    *    const position = tilemap.toPoint({ x: 1, y: 1, z: 0 })
    */
    toPoint(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
    * Project a screen point to tile point
    * @param {IPoint3} point - The screen coordinates to project
    * @param {IRectangle3=} dimensions - The dimensions of each tile on the map, defaults to `this.baseTileDimensions`
    * @param {IPoint=} origin - The origin point of the tile
    * @return {IPoint3} The tile coordinate in the map
    *
    * @example
    *
    *    const tilePosition = tileMap.toTile({ x: 400, y: 300 })
    */
    toTile(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    /**
    * Returns the new position of the tiles' parent container where the given tile is in the center of the viewport.
    * @param {IPoint3} point - The map coordinates to center
    * @return {IPoint}
    *
    * @example
    *
    *    const worldPosition = tilemap.centerToTile({ x: 1, y: 1, z: 0 })
    */
    centerToTile(point: IPoint3): IPoint;
    /**
    * Returns the new position of the tiles' parent container where the given screen point is in the center of the viewport.
    * @param {IPoint3} point - The screen coordinates to center
    * @return {IPoint}
    *
    * @example
    *
    *    const worldPosition = tilemap.centerToPoint({ x: 500, y: 200 })
    */
    centerToPoint(point: IPoint): IPoint;
    /**
    * Calculates the current map bounds and returns the tile coordinates in the center
    * @return {IPoint}
    *
    * @example
    *
    *    const { x, y } = tilemap.centerTile
    */
    get centerTile(): IPoint;
    /**
    * Calls `tilemap.centerToTile(this.centerTile)` and returns the new position of the tiles' parent container where the center tile is in the center of the viewport.
    * @return {IPoint}
    *
    * @example
    *
    *    const { x, y } = tilemap.center()
    */
    center(): IPoint;
    /**
    * Calculates the map bounds of the current tilemap.
    * @return {IBox}
    *
    * @example
    *
    *    const { x, y, width, height, depth } = tilemap.getBounds()
    */
    getBounds(): IBox;
    protected _project(point3: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
    protected _unproject(point: IPoint3, out?: IPoint3): IPoint3;
    protected _getAbsolutePosition(point: IPoint3, dimensions?: IRectangle3, origin?: IPoint): IPoint3;
}
