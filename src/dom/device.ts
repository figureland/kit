import { type StateRecord, record } from '../state'
import { isChrome, isMobile, isSafari } from '../ts'
import { createListener } from '../dom/events'

export const isBrowser = typeof window !== 'undefined'

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
    if (isBrowser && navigator.storage) {
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
}

export const createDevice = (): Device => {
  const state = record<DeviceState>({
    online: navigator?.onLine || true,
    persistence: defaultPersistence(),
    safari: isSafari(),
    chrome: isChrome(),
    mobile: isMobile()
  })

  const setOnline = () => {
    state.key('online').set(true)
  }
  const setOffline = () => {
    state.key('online').set(false)
  }

  getPersistenceStatus().then((persistence) => state.set({ persistence }))

  state.use(createListener(window, 'offline', setOffline))
  state.use(createListener(window, 'online', setOnline))

  return state
}

export type Device = StateRecord<DeviceState>
