import { type State, system, state, type Disposable } from '../state'
import { createListener } from './events'

export const supportsFullscreen = (): boolean =>
  ('fullscreenEnabled' in document && !!document.fullscreenEnabled) ||
  'webkitFullscreenEnabled' in document

export const createFullscreen = (): Fullscreen => {
  const { use, dispose } = system()
  const available = use(state(supportsFullscreen))
  const active = use(state(() => false))

  const setActive = () => active.set(true)
  const setInactive = () => active.set(false)
  const setUnavailable = () => available.set(false)

  use(
    createListener(document, 'fullscreenchange', () => {
      if (!document.fullscreenElement && active.get()) {
        setInactive()
      }
    })
  )

  const open = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen().then(setActive).catch(setUnavailable)
    }
  }

  const close = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(setInactive).catch(setInactive)
    }
  }

  active.on((value) => {
    if (!value) {
      close()
    }
  })

  return {
    open,
    close,
    available,
    active,
    dispose
  }
}

export type Fullscreen = Disposable & {
  open: (element: HTMLElement) => void
  close: () => void
  available: State<boolean>
  active: State<boolean>
}
