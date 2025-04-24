import { negate, vector2 } from '../../math/vector2'
import { store } from '../../state'
import type { InfinityKitTool } from './Tool'

export const moveTool = (): InfinityKitTool => {
  const { dispose } = store()

  let interacting = false

  return {
    dispose,
    meta: {
      title: 'Move',
      icon: 'move',
      command: 'h'
    },
    onPointerDown: async () => {
      interacting = true
    },
    onPointerMove: async (kit, p) => {
      if (interacting) {
        kit.canvas.pan(negate(vector2(), p.delta))
      }
    },
    onPointerUp: async () => {
      interacting = false
    },
    onWheel: async (kit, point, delta) => {
      kit.canvas.wheel(point, delta)
    },
    onDeselect: async () => {
      interacting = false
    }
  }
}
