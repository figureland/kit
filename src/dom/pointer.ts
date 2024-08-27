import { type SignalRecord, record } from '../state'
import {
  allowEvent,
  createListener,
  isPointerEvent,
  type ListenerTarget,
  type PointerInteractionEvent
} from '../dom/events'
import { preciseEnough, vector2, type Vector2 } from '../math/vector2'

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  touchDistance: number
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  button: number | null
  detail: number | null
  origin: Vector2
  delta: Vector2
  point: Vector2
  pinching: boolean
  pointerType: PointerType | null
  active: boolean
  hasDelta: boolean
}

export const defaultPointerState = (): PointerState => ({
  touchDistance: 0,
  shiftKey: false,
  metaKey: false,
  ctrlKey: false,
  detail: null,
  button: 0,
  point: vector2(),
  delta: vector2(),
  origin: vector2(),
  pinching: false,
  pointerType: null,
  active: false,
  hasDelta: false
})

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

export type PointerOptions = {
  target?: ListenerTarget
  filterEvents?: EventFilter
  preventGestureDefault?: boolean
}

export const createPointer = ({
  target = window,
  filterEvents,
  preventGestureDefault = true
}: PointerOptions = {}): Pointer => {
  const state = record(defaultPointerState())
  const prevent = (e: PointerInteractionEvent) => filterEvents?.(e, allowEvent(e))

  const onPointerDown = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }

    const { button, pointerType, shiftKey, metaKey, clientX, clientY, detail } = e
    prevent(e)

    const point = preciseEnough(vector2(clientX, clientY))

    state.set({
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: vector2(),
      point,
      detail,
      origin: point,
      active: true
    })
  }

  const onPointerMove = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }
    const { clientX, clientY, shiftKey, metaKey, ctrlKey, button } = e
    prevent(e)

    const point = preciseEnough(vector2(clientX, clientY))

    const current = state.get()

    const delta = preciseEnough(
      current.active ? vector2(point.x - current.point.x, point.y - current.point.y) : vector2()
    )

    const hasDelta = delta.x !== 0 || delta.y !== 0

    state.set({
      button,
      metaKey,
      shiftKey,
      ctrlKey,
      point,
      delta,
      hasDelta
    })
  }

  const onPointerUp = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }

    prevent(e)
    const { clientX, clientY, shiftKey, metaKey, ctrlKey, button } = e

    const point = preciseEnough(vector2(clientX, clientY))

    const current = state.get()

    const delta = preciseEnough(
      current.active ? vector2(point.x - current.point.x, point.y - current.point.y) : vector2()
    )

    const hasDelta = delta.x !== 0 || delta.y !== 0

    state.set({
      button,
      delta,
      point,
      origin: vector2(),
      pointerType: null,
      pinching: false,
      active: false,
      detail: isPointerEvent(e) ? e.detail : null,
      shiftKey,
      metaKey,
      ctrlKey,
      hasDelta
    })
  }
  state.use(createListener(target, 'wheel', prevent, { passive: false }))
  state.use(createListener(target, 'touchstart', prevent))
  state.use(createListener(target, 'pointermove', onPointerMove))
  state.use(createListener(target, 'pointerdown', onPointerDown))
  state.use(createListener(target, 'pointerup', onPointerUp))
  state.use(createListener(target, 'lostpointercapture', onPointerUp))

  if (preventGestureDefault) {
    state.use(createListener(document, 'gesturestart', prevent))
    state.use(createListener(document, 'gesturechange', prevent))
    state.use(createListener(document, 'gestureend', prevent))
  }

  return state
}

export type Pointer = SignalRecord<PointerState>
