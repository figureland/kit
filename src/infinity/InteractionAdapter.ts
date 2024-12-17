import { vector2 } from '../math/vector2'
import { state, manager, type Disposable } from '../state'
import type { Pointer } from '../dom/pointer'
import { listen, type PointerInteractionEvent } from '../dom/events'
import { isString } from '../tools/guards'
import type { InfinityKit } from './InfinityKit'
import { getDataAttribute, isHTMLElement } from '../dom/element'

export type InteractionAdapter = Disposable & {
  onPointerDown: (e: PointerInteractionEvent) => void
  onPointerUp: (e: PointerInteractionEvent) => void
  onPointerOver: (e: PointerInteractionEvent) => void
  onPointerMove: (e: PointerInteractionEvent) => void
  onPointerOut: (e: PointerInteractionEvent) => void
  onFocusIn: (e: FocusEvent) => void
  onFocusOut: (e: FocusEvent) => void
  onScroll: (e: Event) => void
  onBlur: (e: FocusEvent) => void
  onWheel: (e: WheelEvent) => void
}

export const createInteractionAdapter = <P extends Pointer>(
  pointer: P,
  kit: InfinityKit<any, any>
): InteractionAdapter => {
  const { use, dispose } = manager()
  use(
    state((get) => {
      get(pointer.key('point'))
      kit.onPointerMove(pointer.get())
    })
  )

  return {
    onPointerDown: (e: PointerInteractionEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      kit.onPointerDown(pointer.get())
    },
    onPointerUp: (_e: PointerInteractionEvent) => {
      kit.onPointerUp(pointer.get())
    },
    onPointerOver: (_e: PointerInteractionEvent) => {
      kit.onFocus()
    },
    onPointerMove: (_e: PointerInteractionEvent) => {
      _e.preventDefault()
    },
    onPointerOut: (_e: PointerInteractionEvent) => {
      kit.onBlur()
    },
    onFocusIn: (e: FocusEvent) => {
      if (isHTMLElement(e.target)) {
        const selectedEntity = getDataAttribute(e.target, 'entity')
        if (selectedEntity) {
          console.log('select', selectedEntity)
        }
      }
      kit.onFocus()
    },
    onFocusOut: (e: FocusEvent) => {
      if (isHTMLElement(e.target)) {
        const selectedEntity = getDataAttribute(e.target, 'entity')
        if (selectedEntity) {
          console.log('unselect', selectedEntity)
        }
      }
    },
    onBlur: (_e: FocusEvent) => {
      kit.onBlur()
    },
    onWheel: (e: WheelEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus()
      }
      kit.onWheel(vector2(e.clientX, e.clientY), vector2(e.deltaX, e.deltaY))
    },
    onScroll: (e: Event) => {
      // This intercepts the browser's scroll event and pans the canvas instead.
      // Specifically this is useful when the user uses tab interaction to focus
      // to a focusable/tabbable element that is partially or fully offscreen.
      if (e.target instanceof HTMLElement) {
        kit.canvas.pan(vector2(e.target.scrollLeft, e.target.scrollTop))
        e.target.scrollTop = 0
        e.target.scrollLeft = 0
      }
    },
    dispose
  }
}

export const attachInteractionAdapter = (
  target: HTMLElement | string,
  handler: InteractionAdapter
): Disposable => {
  try {
    const element = isString(target) ? document.querySelector(target) : target
    if (!isHTMLElement(element)) {
      throw new Error(`Invalid attach target: ${target}`)
    }
    const { dispose, use } = manager()
    use(
      listen(element, {
        pointerdown: handler.onPointerDown,
        pointerup: handler.onPointerUp,
        pointerover: handler.onPointerOver,
        pointermove: handler.onPointerMove,
        pointerout: handler.onPointerOut,
        focusin: handler.onFocusIn,
        focusout: handler.onFocusOut,
        blur: handler.onBlur,
        wheel: handler.onWheel
      })
    )
    return {
      dispose
    }
  } catch (e) {
    throw e
  }
}
