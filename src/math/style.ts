/// <reference lib="dom" />

import type { Box, Matrix2D, Vector2 } from './api'
import { box } from './box'
import { matrix2D, set as setMat2D } from './matrix2D'
import { set as setVec2D, vector2 } from './vector2'
import { set as setBox } from './box'

export const transform = (matrix: Matrix2D) =>
  `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, ${matrix[4]}, ${matrix[5]})`

export const scale = (s: number) => transform([s, 0, 0, s, 0, 0])

export const translate = (v: Vector2) => transform([1, 0, 0, 1, v.x, v.y])

export const boxFromElement = (element: HTMLElement): Box =>
  fromDOMRect(element.getBoundingClientRect())

export const toDOMMatrix = (m: Matrix2D) => new DOMMatrix(m)

export const fromDOMMatrix = (m: DOMMatrix, o: Matrix2D = matrix2D()) =>
  setMat2D(o, m.a, m.b, m.c, m.d, m.e, m.f)

export const toDOMMatrixReadOnly = (m: Matrix2D) => new DOMMatrixReadOnly(m)

export const fromDOMMatrixReadOnly = (m: DOMMatrixReadOnly, o: Matrix2D = matrix2D()) =>
  setMat2D(o, m.a, m.b, m.c, m.d, m.e, m.f)

export const toDOMPoint = (v: Vector2) => new DOMPoint(v.x, v.y)

export const toDOMPointReadOnly = (v: Vector2) => new DOMPointReadOnly(v.x, v.y)

export const fromDOMPoint = (v: DOMPoint, o: Vector2 = vector2()) => setVec2D(o, v.x, v.y)

export const fromDOMPointReadOnly = (v: DOMPointReadOnly, o: Vector2 = vector2()) =>
  setVec2D(o, v.x, v.y)

export const fromDOMQuad = (quad: DOMQuad) =>
  box(quad.p1.x, quad.p1.y, quad.p2.x - quad.p1.x, quad.p3.y - quad.p1.y)

export const toDOMQuad = (b: Box) =>
  new DOMQuad(
    new DOMPoint(b.x, b.y),
    new DOMPoint(b.x + b.width, b.y),
    new DOMPoint(b.x, b.y + b.height),
    new DOMPoint(b.x + b.width, b.y + b.height)
  )

export const toDOMRect = (b: Box) => new DOMRect(b.x, b.y, b.width, b.height)

export const fromDOMRect = (r: DOMRect, o: Box = box()) => setBox(o, r.x, r.y, r.width, r.height)

export const toDOMRectReadOnly = (b: Box) => new DOMRectReadOnly(b.x, b.y, b.width, b.height)

export const fromDOMRectReadOnly = (r: DOMRectReadOnly, o: Box = box()) =>
  setBox(o, r.x, r.y, r.width, r.height)
