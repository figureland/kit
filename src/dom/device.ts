import { type Shape } from '../state'
import { isChrome, isMobile, isSafari } from '../tools'
import { listen } from '../dom/events'
import { getPlatform, type Platform } from '../tools/device'
import { shape } from '../state/shape'

export const isBrowser = () => typeof window !== 'undefined'

export type PersistenceStatus = {
  available: number
  canPersist: boolean
}

const defaultPersistence = (): PersistenceStatus => ({
  available: 0,
  canPersist: false
})

export const getPersistenceStatus = async (): Promise<PersistenceStatus> => {
  const persistenceResult = defaultPersistence()
  try {
    if (isBrowser() && navigator.storage) {
      if (navigator.storage.estimate) {
        const storageEstimate = await navigator.storage.estimate()
        const hasQuota = !!storageEstimate.quota && !!storageEstimate.usage

        const { usage = 0, quota = 0 } = storageEstimate
        persistenceResult.available = quota > usage && hasQuota ? quota - usage : 0
      }
      if (navigator.storage.persisted) {
        const persistent = await navigator.storage.persisted()
        if (!persistent && navigator.storage.persist) {
          persistenceResult.canPersist = await navigator.storage.persist()
        }
      } else if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'persistent-storage' })
        persistenceResult.canPersist = permission.state === 'granted'
      }
    } else {
      throw false
    }
  } catch (error) {
    throw new Error(`Could not access navigator.storage`)
  }
  return persistenceResult
}

export type DeviceState = {
  online: boolean
  persistence: PersistenceStatus
  safari: boolean
  chrome: boolean
  mobile: boolean
  platform: Platform
}

export const createDevice = (): Device => {
  const state = shape<DeviceState>({
    online: navigator?.onLine || true,
    persistence: defaultPersistence(),
    safari: isSafari(),
    chrome: isChrome(),
    mobile: isMobile(),
    platform: getPlatform()
  })

  getPersistenceStatus().then((persistence) => state.set({ persistence }))

  state.use(
    listen(window, {
      online: () => {
        state.key('online').set(true)
      },
      offline: () => {
        state.key('online').set(false)
      }
    })
  )

  return state
}

export type Device = Shape<DeviceState>
