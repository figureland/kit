import { disposable, type Disposable } from '../state'
import { entries } from '../tools'

export type ListenerTarget = Document | Window | HTMLElement | ScreenOrientation | MediaQueryList

export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent

export type UnifiedEventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap & {
    gesturestart: Event
    gesturechange: Event
    gestureend: Event
  } & {
    change: MediaQueryListEvent
  }

type MediaQueryHandlers = {
  [K in keyof Pick<UnifiedEventMap, 'change'>]: (e: UnifiedEventMap[K]) => void
}

type EventHandlerConfig<T extends ListenerTarget> = T extends MediaQueryList
  ? MediaQueryHandlers
  : {
      [K in keyof UnifiedEventMap]?: (e: UnifiedEventMap[K]) => void
    }

export const listen = <T extends ListenerTarget>(
  target: T,
  handlers: EventHandlerConfig<T>,
  opts?: AddEventListenerOptions
): Disposable => {
  const cleanupFns: Array<() => void> = []

  for (const [eventName, handler] of entries(handlers)) {
    if (!handler) continue
    target.addEventListener(eventName as string, handler as EventListener, opts)
    cleanupFns.push(() => target.removeEventListener(eventName as string, handler as EventListener))
  }

  return disposable(() => cleanupFns.forEach((fn) => fn()))
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
