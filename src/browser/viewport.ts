import { type Struct, struct, extend } from '../state'
import { dp } from '../math/number'
import type { Size } from '../math/size'
import { listen } from './dom-events'
import { getClosestBreakpoint, type Breakpoints } from './utils/breakpoints'
import { isBrowser } from './device'

export type ViewportState<B> = {
  visible: boolean
  size: Size
  scale: number
  orientation: OrientationType
  breakpoint: keyof B
  isKeyboardOpen: boolean
}

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth)
const detectKeyboard = (minKeyboardHeight = 300): boolean => {
  if (!isBrowser || !window.visualViewport) {
    return false
  }
  return window.screen.height - minKeyboardHeight > window.visualViewport.height
}

const defaultBreakpoint: Breakpoints = {
  default: 0
}

export const createViewport = <B extends Breakpoints>(
  breakpoints: B = defaultBreakpoint as B,
  minKeyboardHeight = 300
): Viewport<B> => {
  const size = getWindowSize()
  const state = struct<ViewportState<B>>({
    visible: true,
    size,
    scale: getWindowScale(),
    orientation: screen?.orientation?.type || 'landscape-primary',
    breakpoint: getClosestBreakpoint(breakpoints, size.width),
    isKeyboardOpen: detectKeyboard(minKeyboardHeight)
  })

  const resize = () => {
    state.set({
      scale: getWindowScale(),
      size: getWindowSize(),
      breakpoint: getClosestBreakpoint(breakpoints, window.innerWidth),
      isKeyboardOpen: detectKeyboard(minKeyboardHeight)
    })
  }

  const onVisualViewportResize = () => {
    state.set({
      isKeyboardOpen: detectKeyboard(minKeyboardHeight)
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

  if (isBrowser && window.visualViewport) {
    state.use(
      listen(window.visualViewport, {
        resize: onVisualViewportResize
      })
    )
  }

  const is = (b: keyof B) => state.key('breakpoint').get() === b
  const isKeyboard = () => state.key('isKeyboardOpen').get()

  return extend(state, {
    is,
    isKeyboard
  })
}

export type Viewport<B = Breakpoints> = Struct<ViewportState<B>> & {
  is: (b: keyof B) => boolean
  isKeyboard: () => boolean
}
