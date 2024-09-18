import { readonly, record } from '../state'
import { createListener, mediaQuery } from '../dom/events'
import { extend } from '../ts/object'

type PreferenceState = {
  colorScheme: 'light' | 'dark' | 'system'
  reducedMotion: boolean
  reducedContrast: boolean
}

export const createPreferences = () => {
  const colorScheme = mediaQuery('prefers-color-scheme: dark')
  const reducedMotion = mediaQuery('prefers-reduced-motion: reduce')
  const reducedContrast = mediaQuery('prefers-contrast: no-preference')

  const state = record<PreferenceState>({
    colorScheme: 'system',
    reducedMotion: false,
    reducedContrast: false
  })

  state.use(
    createListener(colorScheme, 'change', (e) => {
      state.set({ colorScheme: e.matches ? 'dark' : 'light' })
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

  const setTheme = (scheme: 'light' | 'dark' | 'system') => {
    state.set({ colorScheme: scheme })
  }

  return extend(readonly(state), { setTheme })
}

export type Preferences = ReturnType<typeof createPreferences>
