import { system } from '../../state'
import type { InfinityKitTool } from './Tool'

export const entityTool = (): InfinityKitTool => {
  const { dispose } = system()

  return {
    dispose,
    meta: {
      title: 'Add node',
      icon: 'entity'
    },
    onPointerDown: async (kit, p) => {},
    onPointerMove: async (kit, p) => {},
    onPointerUp: async (kit, p) => {},
    onWheel: async (kit, p) => {},
    onSelect: async () => {
      console.log('enter entity')
    },
    onDeselect: async () => {
      console.log('exit entity')
    }
  }
}
