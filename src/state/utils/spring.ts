import { abs } from '../math'

export type SpringOptions = {
  stiffness: number
  damping: number
  precision: number
}

export const calculateSpring = (
  value: number,
  target: number,
  velocity: number,
  delta: number,
  options: SpringOptions
): [number, number] => {
  const force = options.stiffness * (target - value)
  const damper = options.damping * velocity
  const acceleration = force - damper
  const newVelocity = velocity + acceleration * delta
  const newValue = value + newVelocity * delta

  if (abs(newVelocity) < options.precision && abs(target - newValue) < options.precision) {
    return [target, 0]
  }

  return [newValue, newVelocity]
}
