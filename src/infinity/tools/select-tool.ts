import { lifecycle } from '../../state'
import { box, preciseEnough } from '../../math/box'
import { copy, vector2 } from '../../math/vector2'
import { min, max } from '../../math/number'
import type { InfinityKitTool } from './Tool'

const lastInArray = <T>(array: T[]): T | undefined => array[array.length - 1]

const mergeSelection = <T>(array1: T[], array2: T[], toggle?: boolean): T[] => {
  const set = new Set(array1)
  for (const item of array2) {
    if (set.has(item) && toggle) {
      set.delete(item)
    } else {
      set.add(item)
    }
  }

  return Array.from(set)
}

export const selectTool = (): InfinityKitTool => {
  const { dispose } = lifecycle()
  const brushOrigin = vector2()
  let interacting = false
  let additiveSelection = false
  let initialSelection: string[] = []
  let gestureSelection: string[] = []

  const selectionQuery = Symbol()

  return {
    dispose,
    meta: {
      title: 'Select',
      icon: 'select',
      command: 'v'
    },
    onPointerDown: async (kit, { point, shiftKey }) => {
      copy(brushOrigin, kit.canvas.screenToCanvas(point))

      initialSelection = [...kit.state.get().selection]
      interacting = true
      additiveSelection = shiftKey

      const intersection = await kit.api.search(selectionQuery, {
        point: brushOrigin
      })

      const selected = lastInArray(intersection.point)

      if (selected) {
        console.log('intersection', selected)
      }

      kit.state.set(() => ({
        hover: selected,
        selectionBounds: box(),
        brush: box(brushOrigin.x, brushOrigin.y, 0, 0)
      }))
    },
    onPointerMove: async (kit, { point, shiftKey }) => {
      additiveSelection = shiftKey
      const pt = kit.canvas.screenToCanvas(point)
      const x = min(brushOrigin.x, pt.x)
      const y = min(brushOrigin.y, pt.y)
      const width = max(brushOrigin.x, pt.x) - x
      const height = max(brushOrigin.y, pt.y) - y

      const brush = preciseEnough(box(x, y, width, height))

      const intersection = await kit.api.search(selectionQuery, {
        point: pt,
        box: brush
      })

      if (interacting) {
        kit.state.set(() => ({
          selection: additiveSelection
            ? mergeSelection(initialSelection, intersection.box)
            : intersection.box,
          brush
        }))
      } else {
        const selected = lastInArray(intersection.point)
        kit.state.set(() => ({ hover: selected }))
      }
    },
    onPointerUp: async (kit, { point, shiftKey }) => {
      const brush = box()
      interacting = false
      additiveSelection = shiftKey

      // const pt = kit.canvas.screenToCanvas(point)

      // const intersection = await kit.api.search(selectionQuery, {
      //   point: pt
      // })

      // const selected = lastInArray(intersection.point)

      // let selection: string[] = [...kit.state.get().selection]

      // console.log('selected', selected, additiveSelection, selection.includes(selected))
      // if (selected) {
      //   selection = mergeSelection(selection, [selected], additiveSelection)
      //   // selection = mergeArrays(selection, [selected], additiveSelection)
      // }

      // const selectionBounds = selection.length > 0 ? kit.api.boundingBox(selection) : box()

      kit.state.set({
        // selection,
        // selectionBounds,
        brush
      })
    },
    onClick: async () => {
      console.log('click')
    },
    onDoubleClick: async () => {
      console.log('double click')
    },
    onWheel: async (kit, point, delta) => {
      kit.canvas.wheel(point, delta)
    },
    onSelect: async (kit) => {},
    onDeselect: async (kit) => {
      kit.state.set({
        selection: [],
        selectionBounds: box(),
        brush: box()
      })
    }
  }
}
