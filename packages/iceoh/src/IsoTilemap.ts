import { IPoint3, IPoint, IRectangle3, MapThree } from "./interfaces";
import { set, sum, CLASSIC, get, remove } from "./utils";
import { Tilemap, ITilemapConfig } from "./Tilemap";

/**
 * Object extending `ITilemapConfig` with optional projectionAngle, defaulting to `CLASSIC`
 */
export interface IIsoTilemapConfig extends ITilemapConfig {
  /** Isometric projection angle, defaults to `CLASSIC` */
  angle?: number;
  /**
   * It's a good idea to clamp your values to aid performance. In general having values aligned around the 0.5 value will produce a well performing and visually appealing display.
   */
  clamp?: boolean;
}

/**
 * Class that extends basic 2D Tilemap functionality based on given projectionAngle.
 * @param {T} - The type of sprite object to store
 * @extends Tilemap
 */
export class IsoTilemap<T> extends Tilemap<T> {
  protected readonly angle: number;
  protected readonly angleCos: number;
  protected readonly angleSin: number;
  protected readonly clamp: boolean;

  protected readonly baseOrigin: IPoint;
  protected readonly baseSurfaceHeight: number;
  protected readonly baseSurfaceHalfHeight: number;
  readonly depthMap: MapThree<T> = new Map();

  /**
   * Create an `IsoTilemap<T>` instance.
   * @param {IIsoTilemapConfig} config - projectionAngle will default to CLASSIC
   */
  constructor({ angle = CLASSIC, clamp = true, ...config }: IIsoTilemapConfig) {
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
      this.baseTileDimensions.height - this.baseTileDimensions.depth;
    this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2;
  }

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
  public add(
    sprite: T,
    point: IPoint3,
    dimensions: IRectangle3 = this.baseTileDimensions,
    origin = this.baseTileOrigin
  ): IPoint3 {
    this.tiles.push(sprite);
    const tile = this.tiles[this.tiles.indexOf(sprite)];
    if (dimensions !== this.baseTileDimensions) {
      let d = dimensions.depth / this.baseTileDimensions.depth;
      for (let i = d, z = point.z; i > 0; i--, z++) {
        if (i > 1) {
          set(
            this.depthMap,
            [z, point.x, point.y],
            this.baseTileDimensions.depth
          );
        } else {
          set(
            this.depthMap,
            [z, point.x, point.y],
            this.baseTileDimensions.depth * i
          );
        }
        set(this.map, [z, point.x, point.y], tile);
      }
    } else {
      set(
        this.depthMap,
        [point.z, point.x, point.y],
        this.baseTileDimensions.depth
      );
      set(this.map, [point.z, point.x, point.y], tile);
    }
    this.recalculateBounds(point);
    return this._project(
      this._getAbsolutePosition(point),
      dimensions,
      origin,
      sum(this.getColumn<number>(point, this.depthMap).slice(1, point.z))
    );
  }

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
  public remove(point: IPoint3): T {
    const tile = this.get(point);
    if (!tile) return null;
    for (const [z, grid] of this.map) {
      try {
        if (get(grid, [point.x, point.y]) === tile) {
          remove(this.depthMap, [z, point.x, point.y]);
          remove(this.map, [z, point.x, point.y]);
        }
      } catch {}
    }
    this.recalculateBounds(point);
    return this.tiles.splice(this.tiles.indexOf(tile), 1)[0];
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
   *    const tilePosition = isoTilemap.toTile({ x: 400, y: 300 })
   */
  public toTile(
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

  protected _project(
    p: IPoint3,
    dimensions = this.baseTileDimensions,
    origin = this.baseTileOrigin,
    depth: number = 0
  ): IPoint3 {
    // calculate the cartesion coordinates
    const { width, height } = this.getGlobalDimensions();
    const out = {
      x: (p.x - p.y) * this.angleCos + width * this.worldOrigin.x,
      y: (p.x + p.y) * this.angleSin + height * this.worldOrigin.y,
      z: (p.x + p.y) * (p.z + 1 || 1),
    };
    if (dimensions !== this.baseTileDimensions) {
      out.y -= this.baseSurfaceHalfHeight + 0 - this.baseTileOrigin.y; // + (this.baseTileDimensions.depth * point3.z)) - this.baseTileOrigin.y
      out.y +=
        dimensions.height * origin.y -
        (dimensions.height - (dimensions.height - dimensions.depth) / 2);
      out.y -= depth;
    } else {
      out.y -= this.baseTileDimensions.depth * p.z;
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
    const worldDimensions = this.getGlobalDimensions();
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
      y: dimensions.width * origin.y * point.y,
      z: point.z || 0,
    };
  }
}
