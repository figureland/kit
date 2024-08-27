import { readonly, record, type ReadonlySignal } from '../state'
import { createListener, mediaQuery } from '../dom/events'

type PreferenceState = {
  theme: 'light' | 'dark'
  reducedMotion: boolean
  reducedContrast: boolean
}

export const createPreferences = () => {
  const theme = mediaQuery('prefers-color-scheme: dark')
  const reducedMotion = mediaQuery('prefers-reduced-motion: reduce')
  const reducedContrast = mediaQuery('prefers-contrast: no-preference')

  const state = record<PreferenceState>({
    theme: theme.matches ? 'dark' : 'light',
    reducedMotion: false,
    reducedContrast: false
  })

  state.use(
    createListener(theme, 'change', (e) => {
      state.set({ theme: e.matches ? 'dark' : 'light' })
    })
  )
  state.use(
    createListener(reducedMotion, 'change', (e) => {
      state.set({ reducedMotion: e.matches })
    })
  )
  state.use(
    createListener(reducedContrast, 'change', (e) => {
      state.set({ reducedContrast: !e.matches })
    })
  )

  return readonly(state)
}

export type Preferences = ReadonlySignal<PreferenceState>
