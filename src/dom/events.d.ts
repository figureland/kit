import type { Disposable } from '../state'

export const isBrowser: boolean
export type ListenerTarget = Document | Window | HTMLElement | ScreenOrientation

export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent

export type AppTouchEvent = TouchEvent

export type UnifiedEventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap & {
    gesturestart: Event
    gesturechange: Event
    gestureend: Event
  }

export const createListener: <T extends keyof UnifiedEventMap>(
  target: ListenerTarget,
  eventName: T,
  fn: (e: UnifiedEventMap[T]) => void,
  opts?: AddEventListenerOptions
) => Disposable

export const isPointerEvent: (event: Event) => event is PointerEvent

export const allowEvent: (e: Event) => boolean

export const preventEvents: (e: PointerInteractionEvent) => boolean

export const isHTMLElement: (target?: unknown) => target is HTMLElement

export const getDataAttribute: (element: HTMLElement, propertyName: string) => string | null
