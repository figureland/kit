import type { Box } from '../math/box'
import {
  matrix2D,
  translate as translateMat2D,
  rotate as rotateMat2D,
  type Matrix2D
} from '../math/matrix2D'
import { dp, isNumber, max, min } from '../math/number'
import { vector2, isVector2, negate, type Vector2 } from '../math/vector2'

export type { Box } from './api'

/**
 * Sets the properties of a Box.
 * @param v - The Box to modify.
 * @param x - The new x coordinate.
 * @param y - The new y coordinate.
 * @param width - The new width (optional, defaults to current width).
 * @param height - The new height (optional, defaults to current height).
 * @returns The modified Box.
 */
export const set = (
  v: Box,
  x: number,
  y: number,
  width: number = v.width,
  height: number = v.height
): Box => {
  v.x = x
  v.y = y
  v.width = width
  v.height = height
  return v
}

/**
 * Creates a new Box with the given dimensions.
 * @param x - The x coordinate (default: 0).
 * @param y - The y coordinate (default: 0).
 * @param width - The width (default: 0).
 * @param height - The height (default: 0).
 * @returns A new Box object.
 */
export const box = (x: number = 0, y: number = 0, width: number = 0, height: number = 0): Box => ({
  x,
  y,
  width,
  height
})

export default box

/**
 * Checks if the given value is a Box.
 * @param v - The value to check.
 * @returns True if the value is a Box, false otherwise.
 */
export const isBox = (v: unknown): v is Box =>
  v != null &&
  isNumber((v as Box).x) &&
  isNumber((v as Box).y) &&
  isNumber((v as Box).width) &&
  isNumber((v as Box).height)

/**
 * Creates a clone of the given box.
 * @param v - The box to clone.
 * @returns A new box with the same properties.
 */
export const clone = (v: Box) => box(v.x, v.y, v.width, v.height)

/**
 * Copies the properties from one box to another.
 * @param v - The box to modify.
 * @param a - The source box.
 * @returns The modified box `v`.
 */
export const copy = (v: Box, a: Box) => set(v, a.x, a.y, a.width, a.height)

/**
 * Resets the box dimensions to zero.
 * @param v - The box to reset.
 * @returns The reset box with zero dimensions.
 */
export const reset = (v: Box) => set(v, 0, 0, 0, 0)

/**
 * Translates a Box by a given Vector2.
 * @param v - The Box to translate.
 * @param t - The Vector2 to translate by.
 * @returns The translated Box.
 */
export const translate = (v: Box, t: Vector2): Box => set(v, v.x + t.x, v.y + t.y)

/**
 * Resizes a Box to the given dimensions.
 * @param v - The Box to resize.
 * @param width - The new width.
 * @param height - The new height.
 * @returns The resized Box.
 */
export const resize = (v: Box, width: number, height: number): Box =>
  set(v, v.x, v.y, width, height)

/**
 * Expands the box to include the specified point.
 * @param v - The box to expand.
 * @param point - The point to include.
 * @returns The expanded box.
 */
export const includePoint = (v: Box, point: Vector2) => {
  const minX = min(v.x, point.x)
  const maxX = max(v.x + v.width, point.x)
  const minY = min(v.y, point.y)
  const maxY = max(v.y + v.height, point.y)
  return set(v, minX, minY, maxX - minX, maxY - minY)
}

/**
 * Expands the box to include another box.
 * @param v - The original box.
 * @param b - The box to include.
 * @returns The expanded box.
 */
export const includeBox = (v: Box, b: Box) => {
  const minX = min(v.x, b.x)
  const maxX = max(v.x + v.width, b.x + b.width)
  const minY = min(v.y, b.y)
  const maxY = max(v.y + v.height, b.y + b.height)
  return set(v, minX, minY, maxX - minX, maxY - minY)
}

/**
 * Determines if a box intersects with another box or a point, optionally considering padding.
 * @param a - The first box
 * @param b - The second entity, which could be another box or a point.
 * @param padding - Optional padding to extend the boundaries of the first box.
 * @returns True if they intersect, false otherwise.
 */
export const intersects = (a: Box, b: Box | Vector2, padding: number = 0): boolean => {
  const a_padded = box(a.x - padding, a.y - padding, a.width + 2 * padding, a.height + 2 * padding)

  if (isBox(b)) {
    return (
      a_padded.x < b.x + b.width &&
      a_padded.x + a_padded.width > b.x &&
      a_padded.y < b.y + b.height &&
      a_padded.y + a_padded.height > b.y
    )
  } else if (isVector2(b)) {
    return (
      b.x >= a_padded.x &&
      b.x <= a_padded.x + a_padded.width &&
      b.y >= a_padded.y &&
      b.y <= a_padded.y + a_padded.height
    )
  }
  return false
}

/**
 * Computes the intersection of two boxes, if they intersect.
 * @param a - The first box.
 * @param b - The second box.
 * @returns The intersection box, or null if no intersection.
 */
export const intersection = (a: Box, b: Box) => {
  if (!intersects(a, b)) return null
  const x = max(a.x, b.x)
  const y = max(a.y, b.y)
  return box(x, y, min(a.x + a.width, b.x + b.width) - x, min(a.y + a.height, b.y + b.height) - y)
}

/**
 * Calculates the bounding box for an array of Boxes.
 * @param boxes - An array of Boxes.
 * @returns The bounding Box that contains all input Boxes.
 */
export const calculateBoundingBox = (boxes: Box[]): Box => {
  if (boxes.length === 0) {
    return box()
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const b of boxes) {
    const box = isBox(b) ? b : b[1]
    minX = min(minX, box.x)
    minY = min(minY, box.y)
    maxX = max(maxX, box.x + box.width)
    maxY = max(maxY, box.y + box.height)
  }

  return box(minX, minY, maxX - minX, maxY - minY)
}

/**
 * Applies a Matrix2D transformation to a Box and returns the bounding box of the result.
 * @param box - The box to transform.
 * @param matrix - The transformation matrix to apply.
 * @returns The transformed bounding box.
 */
export const transformBox = (b: Box, matrix: Matrix2D): Box => {
  const transformed = [
    { x: b.x, y: b.y },
    { x: b.x + b.width, y: b.y },
    { x: b.x, y: b.y + b.height },
    { x: b.x + b.width, y: b.y + b.height }
  ].map((corner) => {
    const newX = matrix[0] * corner.x + matrix[2] * corner.y + matrix[4]
    const newY = matrix[1] * corner.x + matrix[3] * corner.y + matrix[5]
    return vector2(newX, newY)
  })

  const minX = min(...transformed.map((pt) => pt.x))
  const maxX = max(...transformed.map((pt) => pt.x))
  const minY = min(...transformed.map((pt) => pt.y))
  const maxY = max(...transformed.map((pt) => pt.y))

  return box(minX, minY, maxX - minX, maxY - minY)
}

/**
 * A helper function that rotates a box around its center.
 */
export const rotate = (box: Box, angle: number) => {
  const center = boxCenter(box)
  let matrix = translateMat2D(matrix2D(), matrix2D(), center)
  matrix = rotateMat2D(matrix, matrix, angle)
  translateMat2D(matrix, matrix, negate(center, center))
  return transformBox(box, matrix)
}

/**
 * Calculates the center point of a Box.
 * @param box - The Box to calculate the center for.
 * @returns A Vector2 representing the center point of the Box.
 */
export const boxCenter = (box: Box): Vector2 =>
  vector2(box.x + box.width / 2, box.y + box.height / 2)

/**
 * Rounds the dimensions of a Box to a precise enough level.
 * @param b - The Box to adjust.
 * @returns The Box with rounded dimensions.
 */
export const preciseEnough = (b: Box): Box => set(b, dp(b.x), dp(b.y), dp(b.width), dp(b.height))
