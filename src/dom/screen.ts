import { type Shape, shape } from '../state'
import { dp } from '../math'
import type { Size } from '../math/size'
import { listen } from '../dom/events'
import { getClosestBreakpoint, type Breakpoints } from './utils/breakpoints'
import { extend } from '../tools/object'

export type ScreenState<B> = {
  visible: boolean
  size: Size
  scale: number
  orientation: OrientationType
  breakpoint: keyof B
}

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth)

const defaultBreakpoint: Breakpoints = {
  default: 0
}

export const createScreen = <B extends Breakpoints>(
  breakpoints: B = defaultBreakpoint as B
): Screen<B> => {
  const size = getWindowSize()
  const state = shape<ScreenState<B>>({
    visible: true,
    size,
    scale: getWindowScale(),
    orientation: screen?.orientation?.type || 'landscape-primary',
    breakpoint: getClosestBreakpoint(breakpoints, size.width)
  })

  const resize = () => {
    state.set({
      scale: getWindowScale(),
      size: getWindowSize(),
      breakpoint: getClosestBreakpoint(breakpoints, window.innerWidth)
    })
  }

  const onVisibilityChange = () => {
    state.set({
      visible: document.visibilityState !== 'hidden'
    })
  }

  const onOrientationChange = () => {
    state.set({
      orientation: screen.orientation.type
    })
  }

  state.use(
    listen(screen.orientation, {
      change: onOrientationChange
    })
  )
  state.use(
    listen(document, {
      visibilitychange: onVisibilityChange,
      resize
    })
  )

  const is = (b: keyof B) => state.key('breakpoint').get() === b

  return extend(state, {
    is
  })
}

export type Screen<B = Breakpoints> = Shape<ScreenState<B>> & {
  is: (b: keyof B) => boolean
}
