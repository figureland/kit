import { store } from '../../state'
import type { InfinityKitTool } from './Tool'

export const regionTool = (): InfinityKitTool => {
  const { dispose } = store()

  return {
    dispose,
    meta: {
      title: 'Add region',
      icon: 'region',
      command: 'r'
    },
    onPointerDown: async (kit, p) => {},
    onPointerMove: async (kit, p) => {},
    onPointerUp: async (kit, p) => {},
    onWheel: async (kit, p) => {},
    onSelect: async (kit) => {},
    onDeselect: async (kit) => {}
  }
}
