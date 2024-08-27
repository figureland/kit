import { cos, floor, sin } from '../math/number'
import { vector2 } from '../math/vector2'
import { TAU } from '../math/constants'
import type { Box, Vector2 } from './api'

export type Random = () => number

const { random } = Math

export const randomInt = (min: number, max: number, r: Random = random) =>
  floor(r() * (max - min + 1)) + min

export const randomFloat = (min: number, max: number, r: Random = random) => r() * (max - min) + min

export const randomBool = (r: Random = random) => r() >= 0.5

export const randomSign = (r: Random = random) => (r() >= 0.5 ? 1 : -1)

export const randomElement = <T>(arr: T[], r: Random = random): T =>
  arr[randomInt(0, arr.length - 1)]

export const randomize = <T>(arr: T[], r: Random = random): T[] => [...arr].sort(() => r() - 0.5)

export const randomizeInPlace = <T>(arr: T[], r: Random = random): T[] =>
  [...arr].sort(() => r() - 0.5)

export const randomVector2 = (min: number, max: number, r: Random = random) =>
  vector2(randomFloat(min, max, r), randomFloat(min, max, r))

export const randomVector2InBox = (box: Box, r: Random = random) =>
  vector2(randomFloat(box.x, box.x + box.width, r), randomFloat(box.y, box.y + box.height, r))

export const randomVector2InCircle = (radius: number, r: Random = random) => {
  const angle = randomFloat(0, TAU, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

export const randomVector2InEllipse = (rx: number, ry: number, r: Random = random) => {
  const angle = randomFloat(0, TAU, r)
  return vector2(rx * cos(angle), ry * sin(angle))
}

export const randomVector2InRing = (
  innerRadius: number,
  outerRadius: number,
  r: Random = random
) => {
  const angle = randomFloat(0, TAU, r)
  const radius = randomFloat(innerRadius, outerRadius, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

export const randomVector2InSector = (
  radius: number,
  minAngle: number,
  maxAngle: number,
  r: Random = random
) => {
  const angle = randomFloat(minAngle, maxAngle, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

export const randomVector2InTriangle = (a: Vector2, b: Vector2, c: Vector2, r: Random = random) => {
  const u = randomFloat(0, 1, r)
  const v = randomFloat(0, 1 - u, r)

  return vector2(a.x + u * (b.x - a.x) + v * (c.x - a.x), a.y + u * (b.y - a.y) + v * (c.y - a.y))
}
