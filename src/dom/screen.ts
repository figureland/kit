import { type StateRecord, record } from '../state'
import { dp } from '../math'
import type { Size } from '../math/size'
import { createListener } from '../dom/events'
import { getClosestBreakpoint, type Breakpoints } from './utils/breakpoints'

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
  const state = record<ScreenState<B>>({
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

  state.use(createListener(screen.orientation, 'change', onOrientationChange))
  state.use(createListener(document, 'visibilitychange', onVisibilityChange))
  state.use(createListener(document, 'resize', resize))

  const is = (b: keyof B) => state.key('breakpoint').get() === b

  return {
    ...state,
    is
  }
}

export type Screen<B = Breakpoints> = StateRecord<ScreenState<B>> & {
  is: (b: keyof B) => boolean
}
