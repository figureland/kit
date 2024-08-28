import { keys } from '../../ts'

export type Breakpoints = {
  [key: string]: number
}

export const getClosestBreakpoint = <B extends Breakpoints>(
  breakpoints: B,
  width: number
): keyof B => {
  const names = keys(breakpoints)
  let closest = names[0]
  let closestWidth = breakpoints[closest]

  for (const key of names) {
    const breakpoint = breakpoints[key]

    if (width >= breakpoint && breakpoint > closestWidth) {
      closest = key
      closestWidth = breakpoint
    }
  }
  return closest
}
