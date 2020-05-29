import { IPoint3, IPoint, IRectangle, IRectangle3 } from './interfaces'
import { get, set, sum, MIDDLE } from './utils'

export interface ITilemapConfig {
  worldOrigin?: IPoint
  baseTileOrigin?: IPoint
  baseTileDimensions: IRectangle3
  getGlobalDimensions: () => IRectangle
  getWorldPosition: () => IPoint
  getWorldScale: () => IPoint
}

export class Tilemap<T> {
  protected getGlobalDimensions: () => IRectangle
  protected getWorldPosition: () => IPoint
  protected getWorldScale: () => IPoint
  protected baseTileDimensions: IRectangle3

  protected readonly worldOrigin: IPoint = MIDDLE
  protected readonly baseTileOrigin: IPoint = MIDDLE
  protected readonly tiles: T[] = []
  protected readonly map: { [layer: number]: { [row: number]: { [col: number]: T } } } = {}

  constructor({ worldOrigin, baseTileOrigin, baseTileDimensions, getGlobalDimensions, getWorldPosition, getWorldScale }: ITilemapConfig) {
    this.worldOrigin = worldOrigin || MIDDLE
    this.baseTileOrigin = baseTileOrigin || MIDDLE
    this.baseTileDimensions = baseTileDimensions
    this.getGlobalDimensions = getGlobalDimensions
    this.getWorldPosition = getWorldPosition
    this.getWorldScale = getWorldScale
  }

  public add(sprite: T, point: IPoint3, dimensions: IRectangle3 = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    this.tiles.push(sprite)
    const tile = this.tiles[this.tiles.indexOf(sprite)]
    set(this.map, [point.z, point.x, point.y], tile)
    return this._project(this._getAbsolutePosition(point), dimensions, origin)
  }

  public get(point: IPoint3): T {
    return get(this.map, [point.z || 0, point.x, point.y])
  }

  public getColumn<C>(point: IPoint3, map?: {}): C[] {
    return Object.entries(map || this.map).map(([_, grid]) => get(grid, [point.x, point.y]))
  }

  public move(from: IPoint3, to: IPoint3, dimensions: IRectangle = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    const tile = this.remove(from)
    if (!tile) return null
    return this.add(tile, to, dimensions, origin)
  }

  public remove(point: IPoint3) {
    const tile = this.get(point)
    if (!tile) return null
    delete this.map[point.z][point.x][point.y] // TODO delete all now empty objects after moving
    return this.tiles.splice(this.tiles.indexOf(tile), 1)[0]
  }

  public toPoint(point: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    const scale = this.getWorldScale()
    const worldPosition = this.getWorldPosition()
    const p = this._project(this._getAbsolutePosition(point, dimensions, origin))
    p.x += p.x * (scale.x - 1) + worldPosition.x
    p.y += p.y * (scale.y - 1) + worldPosition.y
    return p
  }

  public toTile(point: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    const p = this._unproject(point)
    return {
      x: Math.round(p.x / dimensions.width),
      y: Math.round(p.y / dimensions.height),
      z: point.z || 0
    }
  }

  public centerToTile(point: IPoint): IPoint {
    return this.centerToPoint(this.toPoint(point))
  }

  public centerToPoint(point: IPoint): IPoint {
    const globalDimensions = this.getGlobalDimensions()
    const worldPosition = this.getWorldPosition()
    return {
      x: worldPosition.x + (globalDimensions.width / 2) - point.x,
      y: worldPosition.y + (globalDimensions.height / 2) - point.y
    }
  }

  public get centerTile(): IPoint {
    return this.getBounds()
  }

  public center(): IPoint {
    return this.centerToTile(this.centerTile)
  }

  public getBounds(): IPoint & IRectangle3 {
    const grids = Object.values(this.map)
    const xes = grids.map(o => Object.keys(o).map(Number)).flat()
    const yes = grids.map(Object.values).flat().map(o => Object.keys(o).map(Number)).flat()

    const minX = Math.min(...xes), maxX = Math.max(...xes), minY = Math.min(...yes), maxY = Math.max(...yes)

    const rect = {
      x: 0,
      y: 0,
      width: maxX - minY,
      height: maxY - minY,
      depth: grids.length
    }

    rect.x = Math.round(minX + (rect.width / 2))
    rect.y = Math.round(minY + (rect.height / 2))

    return rect
  }

  _project(point3: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    const { width, height } = this.getGlobalDimensions();
    return {
      x: point3.x + (width * this.worldOrigin.x),
      y: point3.y + (height * this.worldOrigin.y),
      z: point3.z || 0
    };
  }

  _unproject(point: IPoint3, out: IPoint3 = { x: 0, y: 0, z: 0 }) {
    const { width, height } = this.getGlobalDimensions()
    out.x = point.x - (width * this.worldOrigin.x);
    out.y = point.y - (height * this.worldOrigin.y) + (point.z || 0);
    out.z = point.z
    return out;
  }

  _getAbsolutePosition(point: IPoint3, dimensions = this.baseTileDimensions, origin = this.baseTileOrigin): IPoint3 {
    return {
      x: this.baseTileDimensions.width * point.x,
      y: this.baseTileDimensions.height * point.y,
      z: point.z
    }
  }
}