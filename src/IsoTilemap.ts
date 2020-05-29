import { IPoint3, IPoint, IRectangle, IRectangle3 } from './interfaces'
import { get, set, sum, CLASSIC, MIDDLE } from './utils'
import { Tilemap, ITilemapConfig } from './Tilemap'

export interface IIsoTilemapConfig {
  projectionAngle?: number
}

export class IsoTilemap<T> extends Tilemap<T> {

  protected readonly transform: [number, number] = null
  protected readonly baseOrigin: IPoint
  protected readonly baseSurfaceHeight: number
  protected readonly baseSurfaceHalfHeight: number
  readonly depthMap: { [layer: number]: { [row: number]: { [col: number]: number } } } = {}

  constructor({ projectionAngle = CLASSIC, ...config }: IIsoTilemapConfig & ITilemapConfig) {
    super({ ...config })
    this.transform = [Math.cos(projectionAngle), Math.sin(projectionAngle)];
    this.baseOrigin = { x: this.baseTileDimensions.width * this.baseTileOrigin.x, y: this.baseTileDimensions.height * this.baseTileOrigin.y }
    this.baseSurfaceHeight = (this.baseTileDimensions.height - this.baseTileDimensions.depth)
    this.baseSurfaceHalfHeight = this.baseSurfaceHeight / 2
  }

  public add(sprite: T, point: IPoint3, dimensions: IRectangle3 = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    this.tiles.push(sprite)
    const tile = this.tiles[this.tiles.indexOf(sprite)]
    if (dimensions !== this.baseTileDimensions) {
      let d = dimensions.depth / this.baseTileDimensions.depth
      for (let i = d, z = point.z; i > 0; i--, z++) {
        if (i > 1) {
          set(this.depthMap, [z, point.x, point.y], this.baseTileDimensions.depth)
        } else {
          set(this.depthMap, [z, point.x, point.y], this.baseTileDimensions.depth * i)
        }
        set(this.map, [z, point.x, point.y], tile)
      }
    } else {
      set(this.depthMap, [point.z, point.x, point.y], this.baseTileDimensions.depth)
      set(this.map, [point.z, point.x, point.y], tile)
    }
    return this._project(
      this._getAbsolutePosition(point),
      dimensions,
      origin,
      sum(this.getColumn<number>(point, this.depthMap).slice(1, point.z))
    )
  }

  public remove(point: IPoint3): T {
    const tile = this.get(point)
    if (!tile) return null
    Object.entries(this.map).forEach(([z, grid]) => {
      try {
        if (grid[point.x][point.y] === tile) {
          delete this.depthMap[z][point.x][point.y]
          delete this.map[z][point.x][point.y]
        }
      } catch { }
    })
    return this.tiles.splice(this.tiles.indexOf(tile), 1)[0]
  }

  public toTile(point: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    const p = this._unproject(point)
    const edge = { x: dimensions.width * origin.x, y: dimensions.width * origin.y }
    p.x = Math.floor((p.x + edge.x) / edge.x)
    p.y = Math.floor((p.y + edge.y) / edge.y)
    p.z = p.z || 0
    return p
  }

  _project(point3: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin, depth: number = 0): IPoint3 {
    const out = {
      x: (point3.x - point3.y) * this.transform[0],
      y: (point3.x + point3.y) * this.transform[1],
      z: point3.z || 0
    }

    const { width, height } = this.getGlobalDimensions()
    out.x += width * this.worldOrigin.x
    out.y += + height * this.worldOrigin.y
    out.z = (point3.x + point3.y) * (point3.z + 1 || 1)

    if (dimensions !== this.baseTileDimensions) {
      out.y -= (this.baseSurfaceHalfHeight + 0) - this.baseTileOrigin.y // + (this.baseTileDimensions.depth * point3.z)) - this.baseTileOrigin.y
      out.y += (dimensions.height * origin.y) - (dimensions.height - ((dimensions.height - dimensions.depth) / 2))
      out.y -= depth
    } else {
      out.y -= (this.baseTileDimensions.depth * point3.z)
    }

    return out;
  }

  _unproject(point: IPoint3, out: IPoint3 = { x: 0, y: 0, z: 0 }) {
    const worldDimensions = this.getGlobalDimensions()
    const x = point.x - (worldDimensions.width * this.worldOrigin.x);
    const y = point.y - (worldDimensions.height * this.worldOrigin.y);

    out.x = x / (2 * this.transform[0]) + y / (2 * this.transform[1]);
    out.y = -(x / (2 * this.transform[0])) + y / (2 * this.transform[1]);
    out.z = point.z || 0;

    return out;
  }

  _getAbsolutePosition(point: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    return {
      x: (dimensions.width * origin.x) * point.x, // multiply by scale
      y: (dimensions.width * origin.y) * point.y,
      z: point.z || 0
    }
  }
}