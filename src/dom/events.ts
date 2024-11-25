import { disposable, type Disposable } from '../state'

export type ListenerTarget = Document | Window | HTMLElement | ScreenOrientation | MediaQueryList

export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent

export type AppTouchEvent = TouchEvent

export type UnifiedEventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap & {
    gesturestart: Event
    gesturechange: Event
    gestureend: Event
  } & {
    change: MediaQueryListEvent
  }

export const createListener = <T extends keyof UnifiedEventMap>(
  target: ListenerTarget,
  eventName: T,
  fn: (e: UnifiedEventMap[T]) => void,
  opts?: AddEventListenerOptions
): Disposable => {
  if (target instanceof MediaQueryList && eventName === 'change') {
    target.addEventListener(eventName, fn as (e: MediaQueryListEvent) => void, opts)
    return disposable(() =>
      target.removeEventListener(eventName, fn as (e: MediaQueryListEvent) => void)
    )
  } else {
    target.addEventListener(eventName, fn as EventListener, opts)
    return disposable(() => target.removeEventListener(eventName, fn as EventListener))
  }
}

export const isPointerEvent = (event: Event): event is PointerEvent => event instanceof PointerEvent

export const allowEvent = (e: Event) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return true
  }
  if (e.target instanceof HTMLElement) {
    return true
  }
  return false
}

export const preventEvents = (e: PointerInteractionEvent) => {
  if (!allowEvent(e)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export const mediaQuery = (q: string) => window.matchMedia(`(${q})`)
