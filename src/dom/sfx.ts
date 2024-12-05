import { lifecycle, state, events, type Disposable, type Events } from '../state'

type SoundMap = {
  [sound: string]: string
}

export const sfx = <S extends SoundMap, K extends keyof S>({
  sounds,
  preload
}: {
  sounds: S
  preload?: boolean
}): SFX<S, K> => {
  const instance = lifecycle()
  const loaded = instance.use(state(() => false))
  const audioContext = new AudioContext()
  const buffers = new Map<K, Promise<AudioBuffer>>()
  const activeSources = new Set<AudioBufferSourceNode>()
  const e = events<{ play: { sound: K } }>()

  const loadSound = async (path: string): Promise<AudioBuffer> => {
    const response = await fetch(path)
    const arrayBuffer = await response.arrayBuffer()
    return audioContext.decodeAudioData(arrayBuffer)
  }

  const ensureSoundLoaded = (sound: K): Promise<AudioBuffer> => {
    if (buffers.has(sound)) {
      return buffers.get(sound)!
    } else {
      const promise = loadSound(sounds[sound])
      buffers.set(sound, promise)
      return promise
    }
  }

  if (preload) {
    const allSounds = Object.keys(sounds).map((sound) => ensureSoundLoaded(sound as K))
    Promise.all(allSounds).then(() => loaded.set(true))
  }

  const play = async (sound: K): Promise<void> => {
    try {
      const buffer = await ensureSoundLoaded(sound)
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.destination)
      source.onended = () => activeSources.delete(source)
      source.start(0)
      activeSources.add(source)
      e.emit('play', { sound })
    } catch (error) {
      console.error(error)
    }
  }

  const stop = (): void => {
    activeSources.forEach((source) => {
      source.stop()
      activeSources.delete(source)
    })
  }

  instance.use(stop)
  instance.use(audioContext.close)

  return {
    events: e,
    play,
    stop,
    dispose: instance.dispose
  }
}

export type SFX<S extends SoundMap, K extends keyof S> = Disposable & {
  events: Events<{ play: { sound: K } }>
  play: (sound: K) => Promise<void>
  stop: () => void
}
