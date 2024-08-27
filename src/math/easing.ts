import type { Easing } from './api'
import { PI } from '../math/constants'
import { cos, pow, sin, sqrt } from '../math/number'

export type { Easing } from './api'

export const linear: Easing = (x) => x

export const quadIn: Easing = (x) => x * x

export const quadOut: Easing = (x) => 1 - (1 - x) * (1 - x)

export const quadInOut: Easing = (x) => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2)

export const cubicIn: Easing = (x) => x * x * x

export const cubicOut: Easing = (x) => 1 - pow(1 - x, 3)

export const cubicInOut: Easing = (x) => (x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2)

export const quartIn: Easing = (x) => x * x * x * x

export const quartOut: Easing = (x) => 1 - pow(1 - x, 4)

export const quartInOut: Easing = (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2)

export const quintIn: Easing = (x) => x * x * x * x * x

export const quintOut: Easing = (x) => 1 - pow(1 - x, 5)

export const quintInOut: Easing = (x) =>
  x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2

export const sineIn: Easing = (x) => 1 - cos((x * PI) / 2)

export const sineOut: Easing = (x) => sin((x * PI) / 2)

export const sineInOut: Easing = (x) => -(cos(PI * x) - 1) / 2

export const expoIn: Easing = (x) => (x === 0 ? 0 : pow(2, 10 * x - 10))

export const expoOut: Easing = (x) => (x === 1 ? 1 : 1 - pow(2, -10 * x))

export const expoInOut: Easing = (x) =>
  x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2

export const circIn: Easing = (x) => 1 - sqrt(1 - pow(x, 2))

export const circOut: Easing = (x) => sqrt(1 - pow(x - 1, 2))

export const circInOut: Easing = (x) =>
  x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2

export const backIn: Easing = (x) => 2.70158 * x * x * x - 1.70158 * x * x

export const backOut: Easing = (x) => 1 + 2.70158 * pow(x - 1, 3) + 1.70158 * pow(x - 1, 2)

export const backInOut: Easing = (x) =>
  x < 0.5
    ? (pow(2 * x, 2) * ((2.5949095 + 1) * 2 * x - 2.5949095)) / 2
    : (pow(2 * x - 2, 2) * ((2.5949095 + 1) * (x * 2 - 2) + 2.5949095) + 2) / 2

export const elasticIn: Easing = (x) =>
  x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin(((x * 10 - 10.75) * (2 * PI)) / 3)

export const elasticOut: Easing = (x) =>
  x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin(((x * 10 - 0.75) * (2 * PI)) / 3) + 1

export const elasticInOut: Easing = (x) =>
  x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? -(pow(2, 20 * x - 10) * sin(((20 * x - 11.125) * (2 * PI)) / 4.5)) / 2
        : (pow(2, -20 * x + 10) * sin(((20 * x - 11.125) * (2 * PI)) / 4.5)) / 2 + 1

export const bounceOut: Easing = (x) => {
  const n1 = 7.5625
  const d1 = 2.75
  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}

export const bounceIn: Easing = (x) => 1 - bounceOut(1 - x)

export const bounceInOut: Easing = (x) =>
  x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2

export const polyIn: (v: number) => Easing = (n) => (x) => pow(x, n)

export const polyOut: (v: number) => Easing = (n) => (x) => 1 - pow(1 - x, n)

export const polyInOut: (v: number) => Easing = (n) => (x) =>
  x < 0.5 ? pow(x * 2, n) / 2 : (2 - pow(2 * (1 - x), n)) / 2

export const expIn: Easing = (x) => (x === 0 ? 0 : pow(2, 10 * x - 10))

export const expOut: Easing = (x) => (x === 1 ? 1 : 1 - pow(2, -10 * x))

export const expInOut: Easing = (x) =>
  x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2
