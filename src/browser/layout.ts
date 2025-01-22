import { extend, type Struct, struct } from '../state'

export type LayoutState = {
  loading: boolean
  ready: boolean
  error: boolean
}

export const layout = (): Struct<LayoutState> & {
  load: (options: { size?: string; family?: string }) => Promise<FontFace[]>
} => {
  const state = struct<LayoutState>({
    loading: false,
    ready: false,
    error: false
  })

  state.set({ loading: true })

  document.fonts.onloadingdone = () => {
    state.set({
      ready: true,
      loading: false
    })
  }

  document.fonts.onloadingerror = () => {
    state.set({
      ready: false,
      error: true,
      loading: false
    })
  }

  document.fonts.ready.then(() => {
    state.set({
      ready: true,
      error: false,
      loading: false
    })
  })

  const load = ({ size, family }: { size?: string; family?: string }) =>
    document.fonts.load(`${size} ${family}`)

  return extend(state, { load })
}
