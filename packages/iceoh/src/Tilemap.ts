import {
  IBox,
  IPoint,
  IPoint3,
  IRectangle,
  IRectangle3,
  MapThree,
} from "./interfaces";
import { FULL, MIDDLE, TOP_LEFT, get, pointGet, remove, set } from "./utils";

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
export class Tilemap<T> {
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
  protected readonly worldOrigin: IPoint = MIDDLE;
  /**
   * Description placeholder
   * @date 3/14/2023 - 12:44:55 PM
   *
   * @protected
   * @readonly
   * @type {IPoint}
   */
  protected readonly baseTileOrigin: IPoint = MIDDLE;
  /**
   * Contains references to T values using their tile coordinates for three-dimensional map indices, z -> x -> y
   * @date 3/14/2023 - 12:44:55 PM
   *
   * @protected
   * @readonly
   * @type {MapThree<T>}
   */
  protected readonly map: MapThree<T> = new Map();
  /**
   * Contains the lower and upper bounds of the map's z, x, y axes using tile coordinates
   * @date 3/14/2023 - 12:44:55 PM
   *
   * @protected
   * @readonly
   * @type {{ x: { min: number; max: number; }; y: { min: number; max: number; }; z: { min: number; max: number; }; }}
   */
  protected readonly bounds = {
    x: { min: 0, max: 0 },
    y: { min: 0, max: 0 },
    z: { min: 0, max: 0 },
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
  constructor({
    worldOrigin,
    baseTileOrigin,
    baseTileDimensions,
    getScreenDimensions,
    getWorldPosition,
    getWorldScale,
  }: ITilemapConfig = {}) {
    this.worldOrigin = worldOrigin || MIDDLE;
    this.baseTileOrigin = baseTileOrigin || MIDDLE;
    this.baseTileDimensions = baseTileDimensions || { width: 1, height: 1};
    this.getScreenDimensions = getScreenDimensions || (() => ({ width: 1, height: 1}));
    this.getWorldPosition = getWorldPosition || (() => TOP_LEFT);
    this.getWorldScale = getWorldScale || (() => FULL);
  }

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
  public add(
    t: T,
    tile: IPoint3,
    dimensions: IRectangle3 = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    set(this.map, [tile.z || 0, tile.x, tile.y], t);
    this.recalculateBounds(tile);
    return this.toWorldPoint(tile, dimensions, origin);
  }

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
  public get(point: IPoint3): T {
    return pointGet<T>(this.map, point);
  }

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
  public getColumn<C = T>(point: IPoint, map?: MapThree<C>): C[] {
    const column = [];
    for (const [z, grid] of map || this.map) {
      column[z] = get(grid, [point.x, point.y]);
    }
    return column;
  }

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
  public move(
    from: IPoint3,
    to: IPoint3,
    dimensions: IRectangle = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    const tile = this.remove(from);
    if (!tile) return null;
    return this.add(tile, to, dimensions, origin);
  }

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
  public remove(point: IPoint3): T {
    if (point.z === undefined) point.z = 0;
    const tile = this.get(point);
    if (!tile) return;
    remove(this.map, [point.z || 0, point.x, point.y]);
    this.recalculateBounds(point);
    return tile;
  }

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
  public toScreenPoint(
    tile: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    const position = this.toWorldPoint(tile, dimensions, origin);
    const scale = this.getWorldScale();
    const worldPosition = this.getWorldPosition();
    position.x = position.x * scale.x + worldPosition.x;
    position.y = position.y * scale.y + worldPosition.y;
    return position;
  }

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
  public toWorldPoint(
    tile: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    return this._project(this._getAbsolutePosition(tile), dimensions, origin);
  }

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
  public worldToTile(
    point: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    const p = this._unproject(point);
    return {
      x: Math.round(p.x / dimensions.width),
      y: Math.round(p.y / dimensions.height),
      z: point.z || 0,
    };
  }

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
  public centerToTile(tile: IPoint3): IPoint {
    return this.centerToPoint(this.toScreenPoint(tile));
  }

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
  public centerToPoint(point: IPoint): IPoint {
    const globalDimensions = this.getScreenDimensions();
    const worldPosition = this.getWorldPosition();
    return {
      x: worldPosition.x + globalDimensions.width / 2 - point.x,
      y: worldPosition.y + globalDimensions.height / 2 - point.y,
    };
  }

  /**
   * Calculates the current map bounds and returns the tile coordinates in the center
   * @date 3/14/2023 - 12:44:55 PM
   *
   * @public
   * @readonly
   * @type {IPoint}
   */
  public get centerTile(): IPoint {
    return this.getBounds();
  }

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
  public center(): IPoint {
    return this.centerToTile(this.centerTile);
  }

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
  public getBounds(): IBox {
    const rect = {
      x: 0,
      y: 0,
      width: this.bounds.x.max - this.bounds.x.min,
      height: this.bounds.y.max - this.bounds.y.min,
      depth: this.bounds.z.max - this.bounds.z.min,
    };

    rect.x = Math.round(this.bounds.x.min + rect.width / 2);
    rect.y = Math.round(this.bounds.y.min + rect.height / 2);

    return rect;
  }

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
  protected recalculateBounds(point: IPoint3) {
    if (point.x < this.bounds.x.min) this.bounds.x.min = point.x;
    if (point.x > this.bounds.x.max) this.bounds.x.max = point.x;
    if (point.y < this.bounds.y.min) this.bounds.y.min = point.y;
    if (point.y > this.bounds.y.max) this.bounds.y.max = point.y;
    if (point.z !== undefined) {
      if (point.z < this.bounds.z.min) this.bounds.z.min = point.z;
      if (point.z > this.bounds.z.max) this.bounds.z.max = point.z;
    }
  }

  protected _project(
    point3: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin,
    depth = 0
  ): IPoint3 {
    const { width, height } = this.getScreenDimensions();
    return {
      x: point3.x + width * this.worldOrigin.x,
      y: point3.y + height * this.worldOrigin.y,
      z: point3.z || 0,
    };
  }

  protected _unproject(point: IPoint3, out: IPoint3 = { x: 0, y: 0, z: 0 }) {
    const { width, height } = this.getScreenDimensions();
    out.x = point.x - width * this.worldOrigin.x;
    out.y = point.y - height * this.worldOrigin.y + (point.z || 0);
    out.z = point.z || 0;
    return out;
  }

  protected _getAbsolutePosition(
    point: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    return {
      x: dimensions.width * point.x,
      y: dimensions.height * point.y,
      z: point.z || 0,
    };
  }
}
