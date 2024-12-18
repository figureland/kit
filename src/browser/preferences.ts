import { readonly, shape, extend } from '../state'
import { listen } from './dom-events'
import { mediaQuery } from './media'

type PreferenceState = {
  colorScheme: 'light' | 'dark'
  reducedMotion: boolean
  reducedContrast: boolean
}

export const createPreferences = () => {
  const colorScheme = mediaQuery('prefers-color-scheme: dark')
  const reducedMotion = mediaQuery('prefers-reduced-motion: reduce')
  const reducedContrast = mediaQuery('prefers-contrast: no-preference')

  const state = shape<PreferenceState>({
    colorScheme: colorScheme.matches ? 'dark' : 'light',
    reducedMotion: reducedMotion.matches,
    reducedContrast: reducedContrast.matches
  })

  state.use(
    listen(colorScheme, {
      change: (e) => {
        state.set({ colorScheme: e.matches ? 'dark' : 'light' })
      }
    })
  )
  state.use(
    listen(reducedMotion, {
      change: (e) => {
        state.set({ reducedMotion: e.matches })
      }
    })
  )
  state.use(
    listen(reducedContrast, {
      change: (e) => {
        state.set({ reducedContrast: !e.matches })
      }
    })
  )

  const setTheme = (scheme: 'light' | 'dark') => {
    state.set({ colorScheme: scheme })
  }

  return extend(readonly(state), { setTheme })
}

export type Preferences = ReturnType<typeof createPreferences>
