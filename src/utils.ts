import { IPoint, IPoint3 } from "./interfaces"

//  Projection angles
export const CLASSIC = Math.atan(0.5);
export const ISOMETRIC = Math.PI / 6;
export const MILITARY = Math.PI / 4;

export const TOP_LEFT: IPoint = { x: 0, y: 0 }
export const MIDDLE: IPoint = { x: 0.5, y: 0.5 }
export const ZERO = 0

export enum DIRECTION {
  NONE = 'NONE',
  N = 'N',
  NE = 'NE',
  E = 'E',
  SE = 'SE',
  S = 'S',
  SW = 'SW',
  W = 'W',
  NW = 'NW'
}

export function set<T>(obj: {}, indices: number[], value: T): T {
  var o = obj
  while (indices.length - 1) {
    var n = indices.shift()
    if (!(n in o)) o[n] = {}
    o = o[n]
  }
  o[indices[0]] = value
  return o[indices[0]]
}

export function get<T>(obj: {}, indices: number[], setIfNull?: T): T {
  var o = obj
  while (indices.length) {
    var n = indices.shift()
    if (!(n in o)) {
      if (setIfNull) {
        o[n] = {}
        if (!indices.length) o[n] = setIfNull
      }
      else return
    }
    o = o[n]
  }
  return o as T
}

export function getDistance(p1: IPoint, p2: IPoint) {
  return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

export function sum(numbers: number[]): number {
  return numbers.reduce((s, n) => !!n ? s + n : s, 0)
}

export function getIsoDirection(from: IPoint3, to: IPoint3): DIRECTION {
  let diffX = to.x - from.x, diffY = to.y - from.y
  if (diffX === ZERO && diffY < ZERO) return DIRECTION.N
  if (diffX > ZERO && diffY < ZERO) return DIRECTION.NE
  if (diffX > ZERO && diffY === ZERO) return DIRECTION.E
  if (diffX > ZERO && diffY > ZERO) return DIRECTION.SE
  if (diffX === ZERO && diffY > ZERO) return DIRECTION.S
  if (diffX < ZERO && diffY > ZERO) return DIRECTION.SW
  if (diffX < ZERO && diffY === ZERO) return DIRECTION.W
  if (diffX < ZERO && diffY < ZERO) return DIRECTION.NW
  return DIRECTION.NONE
}
