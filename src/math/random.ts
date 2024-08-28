import { cos, floor, sin } from '../math/number'
import { vector2 } from '../math/vector2'
import { TAU } from '../math/constants'
import type { Box, Vector2 } from './api'

export type Random = () => number

const { random } = Math

/**
 * Generates a random integer between min and max (inclusive).
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (inclusive).
 * @param r - Optional custom random function.
 * @returns A random integer between min and max.
 */
export const randomInt = (min: number, max: number, r: Random = random): number =>
  floor(r() * (max - min + 1)) + min

/**
 * Generates a random float between min and max.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param r - Optional custom random function.
 * @returns A random float between min and max.
 */
export const randomFloat = (min: number, max: number, r: Random = random): number => r() * (max - min) + min

/**
 * Generates a random boolean value.
 * @param r - Optional custom random function.
 * @returns A random boolean.
 */
export const randomBool = (r: Random = random): boolean => r() >= 0.5

/**
 * Generates a random sign (1 or -1).
 * @param r - Optional custom random function.
 * @returns Either 1 or -1 randomly.
 */
export const randomSign = (r: Random = random): number => (r() >= 0.5 ? 1 : -1)

/**
 * Selects a random element from an array.
 * @param arr - The input array.
 * @param r - Optional custom random function.
 * @returns A random element from the array.
 */
export const randomElement = <T>(arr: T[], r: Random = random): T =>
  arr[randomInt(0, arr.length - 1)]

/**
 * Creates a new randomized array from the input array.
 * @param arr - The input array.
 * @param r - Optional custom random function.
 * @returns A new array with the elements randomly shuffled.
 */
export const randomize = <T>(arr: T[], r: Random = random): T[] => [...arr].sort(() => r() - 0.5)

/**
 * Randomizes the input array in place.
 * @param arr - The input array to be randomized.
 * @param r - Optional custom random function.
 * @returns The input array with its elements randomly shuffled.
 */
export const randomizeInPlace = <T>(arr: T[], r: Random = random): T[] =>
  [...arr].sort(() => r() - 0.5)

/**
 * Generates a random Vector2 with components between min and max.
 * @param min - The minimum value for both components.
 * @param max - The maximum value for both components.
 * @param r - Optional custom random function.
 * @returns A random Vector2.
 */
export const randomVector2 = (min: number, max: number, r: Random = random): Vector2 =>
  vector2(randomFloat(min, max, r), randomFloat(min, max, r))

/**
 * Generates a random Vector2 within a given box.
 * @param box - The bounding box.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the box.
 */
export const randomVector2InBox = (box: Box, r: Random = random): Vector2 =>
  vector2(randomFloat(box.x, box.x + box.width, r), randomFloat(box.y, box.y + box.height, r))

/**
 * Generates a random Vector2 within a circle of given radius.
 * @param radius - The radius of the circle.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the circle.
 */
export const randomVector2InCircle = (radius: number, r: Random = random): Vector2 => {
  const angle = randomFloat(0, TAU, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

/**
 * Generates a random Vector2 within an ellipse of given radii.
 * @param rx - The x-radius of the ellipse.
 * @param ry - The y-radius of the ellipse.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the ellipse.
 */
export const randomVector2InEllipse = (rx: number, ry: number, r: Random = random): Vector2 => {
  const angle = randomFloat(0, TAU, r)
  return vector2(rx * cos(angle), ry * sin(angle))
}

/**
 * Generates a random Vector2 within a ring (annulus) defined by inner and outer radii.
 * @param innerRadius - The inner radius of the ring.
 * @param outerRadius - The outer radius of the ring.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the ring.
 */
export const randomVector2InRing = (
  innerRadius: number,
  outerRadius: number,
  r: Random = random
): Vector2 => {
  const angle = randomFloat(0, TAU, r)
  const radius = randomFloat(innerRadius, outerRadius, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

/**
 * Generates a random Vector2 within a sector of a circle.
 * @param radius - The radius of the sector.
 * @param minAngle - The starting angle of the sector.
 * @param maxAngle - The ending angle of the sector.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the sector.
 */
export const randomVector2InSector = (
  radius: number,
  minAngle: number,
  maxAngle: number,
  r: Random = random
): Vector2 => {
  const angle = randomFloat(minAngle, maxAngle, r)
  return vector2(radius * cos(angle), radius * sin(angle))
}

/**
 * Generates a random Vector2 within a triangle defined by three points.
 * @param a - The first point of the triangle.
 * @param b - The second point of the triangle.
 * @param c - The third point of the triangle.
 * @param r - Optional custom random function.
 * @returns A random Vector2 within the triangle.
 */
export const randomVector2InTriangle = (a: Vector2, b: Vector2, c: Vector2, r: Random = random): Vector2 => {
  const u = randomFloat(0, 1, r)
  const v = randomFloat(0, 1 - u, r)

  return vector2(a.x + u * (b.x - a.x) + v * (c.x - a.x), a.y + u * (b.y - a.y) + v * (c.y - a.y))
}
