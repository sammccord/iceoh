import { type ITilemapConfig, Tilemap } from "./Tilemap";
import type {
  ExtendedBox,
  IPoint,
  IPoint3,
  IRectangle3,
  MapThree,
} from "./interfaces";
import { CLASSIC, get, remove, set, sum } from "./utils";

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
export class IsoTilemap<T> extends Tilemap<T> {
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
  readonly tileDimensions: MapThree<ExtendedBox<T>> = new Map();

  /**
   * Creates an instance of IsoTilemap.
   * @date 3/14/2023 - 2:14:31 PM
   *
   * @constructor
   * @param {IIsoTilemapConfig} { angle = CLASSIC, clamp = true, ...config }
   */
  constructor(
    { angle = CLASSIC, clamp = true, ...config }: IIsoTilemapConfig = {
      angle: CLASSIC,
      clamp: true,
    }
  ) {
    super({ ...config });
    this.angle = angle;
    this.angleCos = Math.cos(this.angle);
    this.angleSin = Math.sin(this.angle);
    this.clamp = clamp;
    this.baseOrigin = {
      x: this.baseTileDimensions.width * this.baseTileOrigin.x,
      y: this.baseTileDimensions.height * this.baseTileOrigin.y,
    };
    this.baseSurfaceHeight =
      this.baseTileDimensions.height - (this.baseTileDimensions.depth || 1);
    this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2;
  }

  protected get baseDepth(): number {
    return this.baseTileDimensions.depth || 1
  }

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
  public add(
    v: T,
    tile: IPoint3,
    dimensions: IRectangle3 = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    const position = this.toWorldPoint(tile, dimensions, origin);
    if (dimensions !== this.baseTileDimensions) {
      let d =
        (dimensions.depth || this.baseDepth) /
        this.baseDepth;
      for (let i = d, z = tile.z || 0; i > 0; i--, z++) {
        if (i > 1) {
          set(this.tileDimensions, [z, tile.x, tile.y], {
            ...dimensions,
            origin,
            depth: this.baseDepth,
            z,
            x: position.x,
            y: position.y,
            value: v,
          });
        } else {
          set(this.tileDimensions, [z, tile.x, tile.y], {
            ...dimensions,
            origin,
            depth: this.baseDepth * i,
            z,
            x: position.x,
            y: position.y,
            value: v,
          });
        }
        set(this.map, [z, tile.x, tile.y], tile);
      }
    } else {
      set(this.tileDimensions, [tile.z || 0, tile.x, tile.y], {
        ...dimensions,
        origin,
        z: tile.z || 0,
        x: position.x,
        y: position.y,
        value: v,
      });
      set(this.map, [tile.z || 0, tile.x, tile.y], tile);
    }
    this.recalculateBounds(tile);
    return position;
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
  public remove(point: IPoint3): T | undefined {
    const tile = this.get(point);
    if (!tile) return;
    for (const [z, grid] of this.map) {
      try {
        if (get(grid, [point.x, point.y]) === tile) {
          remove(this.tileDimensions, [z, point.x, point.y]);
          remove(this.map, [z, point.x, point.y]);
        }
      } catch {}
    }
    this.recalculateBounds(point);
    return tile;
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
    const edge = {
      x: dimensions.width * origin.x,
      y: dimensions.width * origin.y,
    };
    p.x = Math.floor((p.x + edge.x) / edge.x);
    p.y = Math.floor((p.y + edge.y) / edge.y);
    p.z = p.z || 0;
    return p;
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
    return this._project(
      this._getAbsolutePosition(tile),
      dimensions,
      origin,
      sum(
        this.getDimensionsColumn(tile)
          .map((b) => b?.depth || this.baseTileDimensions.depth)
          .slice(1, tile.z || 0)
      )
    );
  }

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
  public getDimensionsColumn(tile: IPoint): ExtendedBox<T>[] {
    return this.getColumn(tile, this.tileDimensions);
  }

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
  public castRay(
    point: IPoint,
    include?: (t: T, tile: IPoint3) => boolean
  ): T | undefined {
    const tile = this.worldToTile(point);
    for (let z = this.bounds.z.max; z >= this.bounds.z.min; z--) {
      const colX = tile.x + z;
      const colY = tile.y + z;
      for (let box of this.getDimensionsColumn({
        x: colX,
        y: colY,
      }).reverse()) {
        if (!box) continue;
        const { x, y, value, origin, width, height, tile } = box;
        if (
          point.x >= x - width * origin.x &&
          point.x <= x + width * origin.x &&
          point.y >= y - height * origin.y &&
          point.y <= y + height * origin.y
        ) {
          if (include) {
            if (include(value, tile)) return value;
          } else return value;
        }
      }
    }
  }

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
  public collisionMap(
    point: IPoint,
    include?: (t: T, tile: IPoint3) => boolean
  ): MapThree<T> {
    const ray: MapThree<T> = new Map();
    const tile = this.worldToTile(point);
    for (let z = this.bounds.z.min; z <= this.bounds.z.max; z++) {
      let hasColHit = false;
      const colX = tile.x + z;
      const colY = tile.y + z;
      for (let box of this.getDimensionsColumn({
        x: colX,
        y: colY,
      })) {
        if (!box) continue;
        const { x, y, value, z: level, origin, width, height, tile } = box;
        if (
          point.x >= x - width * origin.x &&
          point.x <= x + width * origin.x &&
          point.y >= y - height * origin.y &&
          point.y <= y + height * origin.y
        ) {
          if (include && !include(value, tile)) {
            continue;
          } else {
            // we've hit a tile
            hasColHit = true;
            set(ray, [level || 0, colX, colY], value);
          }
        } else if (hasColHit) {
          // if we've hit tiles and aren't anymore, break early
          break;
        }
      }
    }
    return ray;
  }

  protected _project(
    p: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin,
    depth: number = 0
  ): IPoint3 {
    // calculate the cartesion coordinates
    const { width, height } = this.getScreenDimensions();
    const out = {
      x: (p.x - p.y) * this.angleCos + width * this.worldOrigin.x,
      y: (p.x + p.y) * this.angleSin + height * this.worldOrigin.y,
      z: (p.x + p.y) * ((p.z || 0) + 1 || 1),
    };
    if (dimensions !== this.baseTileDimensions) {
      out.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y; // + (this.baseTileDimensions.depth * point3.z)) - this.baseTileOrigin.y
      out.y +=
        dimensions.height * origin.y -
        (dimensions.height - (dimensions.height - (dimensions.depth || 0)) / 2);
      out.y -= depth;
    } else {
      out.y -= this.baseDepth * (p.z || 0);
    }
    // if we are clamping, then clamp the values
    // clamp using the fastest proper rounding: http://jsperf.com/math-round-vs-hack/3
    if (this.clamp) {
      out.x = ~~(out.x + (out.x > 0 ? 0.5 : -0.5));
      out.y = ~~(out.y + (out.y > 0 ? 0.5 : -0.5));
    }
    return out;
  }

  protected _unproject(point: IPoint3, out: IPoint3 = { x: 0, y: 0, z: 0 }) {
    const worldDimensions = this.getScreenDimensions();
    const x = point.x - worldDimensions.width * this.worldOrigin.x;
    const y = point.y - worldDimensions.height * this.worldOrigin.y;

    out.x = x / (2 * this.angleCos) + y / (2 * this.angleSin);
    out.y = -(x / (2 * this.angleCos)) + y / (2 * this.angleSin);
    out.z = point.z || 0;

    return out;
  }

  protected _getAbsolutePosition(
    point: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    return {
      x: dimensions.width * origin.x * point.x,
      y: dimensions.height * origin.y * point.y,
      z: point.z || 0,
    };
  }
}
