export type Vector2 = {
  x: number
  y: number
}

export type Vector3 = {
  x: number
  y: number
  z: number
}

export type Vector4 = {
  x: number
  y: number
  z: number
  w: number
}

export type Size = {
  width: number
  height: number
}

export type Box = Vector2 & Size

export type Matrix2D = [number, number, number, number, number, number]

export type Easing = (x: number) => number

export type CubicBezier2D = [Vector2, Vector2, Vector2, Vector2]

export type QuadraticBezier2D = [Vector2, Vector2, Vector2]
