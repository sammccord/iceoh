import {
  IPoint3,
  IPoint,
  IRectangle,
  IRectangle3,
  IBox,
  MapThree,
} from "./interfaces";
import { get, set, MIDDLE, FULL, TOP_LEFT, remove } from "./utils";

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

export class Tilemap<T> {
  protected getGlobalDimensions: () => IRectangle;
  protected getWorldPosition: () => IPoint;
  protected getWorldScale: () => IPoint;
  protected baseTileDimensions: IRectangle3;

  protected readonly worldOrigin: IPoint = MIDDLE;
  protected readonly baseTileOrigin: IPoint = MIDDLE;
  protected readonly tiles: T[] = [];
  protected readonly map: MapThree<T> = new Map();
  protected readonly bounds = {
    x: { min: 0, max: 0 },
    y: { min: 0, max: 0 },
    z: { min: 0, max: 0 },
  };

  /**
   * Create a `Tilemap<T>` instance.
   * @param {ITilemapConfig} config
   */
  constructor({
    worldOrigin,
    baseTileOrigin,
    baseTileDimensions,
    getGlobalDimensions,
    getWorldPosition,
    getWorldScale,
  }: ITilemapConfig) {
    this.worldOrigin = worldOrigin || MIDDLE;
    this.baseTileOrigin = baseTileOrigin || MIDDLE;
    this.baseTileDimensions = baseTileDimensions;
    this.getGlobalDimensions = getGlobalDimensions;
    this.getWorldPosition = getWorldPosition || (() => TOP_LEFT);
    this.getWorldScale = getWorldScale || (() => FULL);
  }

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
  public add(
    sprite: T,
    point: IPoint3,
    dimensions: IRectangle3 = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    this.tiles.push(sprite);
    const tile = this.tiles[this.tiles.indexOf(sprite)];
    set(this.map, [point.z || 0, point.x, point.y], tile);
    this.recalculateBounds(point);
    return this._project(this._getAbsolutePosition(point), dimensions, origin);
  }

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
  public get(point: IPoint3): T {
    return get(this.map, [point.z || 0, point.x, point.y]);
  }

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
   *    const depths = tilemap.getColumn({ x: 1, y: 1 }, tilemap.depthMap)
   */
  public getColumn<C>(point: IPoint, map?: MapThree<T>): C[] {
    const column = [];
    for (const [z, grid] of map || this.map) {
      column[z] = get(grid, [point.x, point.y]);
    }
    return column;
  }

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
   *
   * @param {IPoint3} point - Map coordinates to remove
   * @return {[T][]} An array containing the elements that were deleted.
   *
   * @example
   *
   *    const tile = tilemap.remove({ x: 1, y: 1 })
   */
  public remove(point: IPoint3): T {
    const tile = this.get(point);
    if (!tile) return;
    remove(this.map, [point.z || 0, point.x, point.y]);
    this.recalculateBounds(point);
    return this.tiles.splice(this.tiles.indexOf(tile), 1)[0];
  }

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
  public toPoint(
    point: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    const scale = this.getWorldScale();
    const worldPosition = this.getWorldPosition();
    const p = this._project(
      this._getAbsolutePosition(point, dimensions, origin)
    );
    p.x += p.x * (scale.x - 1) + worldPosition.x;
    p.y += p.y * (scale.y - 1) + worldPosition.y;
    return p;
  }

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
  public toTile(
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
   * Returns the new position of the tiles' parent container where the given tile is in the center of the viewport.
   * @param {IPoint3} point - The map coordinates to center
   * @return {IPoint}
   *
   * @example
   *
   *    const worldPosition = tilemap.centerToTile({ x: 1, y: 1, z: 0 })
   */
  public centerToTile(point: IPoint3): IPoint {
    return this.centerToPoint(this.toPoint(point));
  }

  /**
   * Returns the new position of the tiles' parent container where the given screen point is in the center of the viewport.
   * @param {IPoint3} point - The screen coordinates to center
   * @return {IPoint}
   *
   * @example
   *
   *    const worldPosition = tilemap.centerToPoint({ x: 500, y: 200 })
   */
  public centerToPoint(point: IPoint): IPoint {
    const globalDimensions = this.getGlobalDimensions();
    const worldPosition = this.getWorldPosition();
    return {
      x: worldPosition.x + globalDimensions.width / 2 - point.x,
      y: worldPosition.y + globalDimensions.height / 2 - point.y,
    };
  }

  /**
   * Calculates the current map bounds and returns the tile coordinates in the center
   * @return {IPoint}
   *
   * @example
   *
   *    const { x, y } = tilemap.centerTile
   */
  public get centerTile(): IPoint {
    return this.getBounds();
  }

  /**
   * Calls `tilemap.centerToTile(this.centerTile)` and returns the new position of the tiles' parent container where the center tile is in the center of the viewport.
   * @return {IPoint}
   *
   * @example
   *
   *    const { x, y } = tilemap.center()
   */
  public center(): IPoint {
    return this.centerToTile(this.centerTile);
  }

  /**
   * Calculates the map bounds of the current tilemap.
   * @return {IBox}
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
   * Recalculate bounds
   *
   * @param {IPoint3} point - Map coordinates to remove
   * @return {[T][]} An array containing the elements that were deleted.
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
    origin = this.baseTileOrigin
  ): IPoint3 {
    const { width, height } = this.getGlobalDimensions();
    return {
      x: point3.x + width * this.worldOrigin.x,
      y: point3.y + height * this.worldOrigin.y,
      z: point3.z || 0,
    };
  }

  protected _unproject(point: IPoint3, out: IPoint3 = { x: 0, y: 0, z: 0 }) {
    const { width, height } = this.getGlobalDimensions();
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
      x: this.baseTileDimensions.width * point.x,
      y: this.baseTileDimensions.height * point.y,
      z: point.z || 0,
    };
  }
}
