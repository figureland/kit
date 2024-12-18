import { type Events, type Shape, events, shape, type Disposable, manager } from '../state'
import { isNotNullish } from '../tools/guards'
import { listen, type ListenerTarget } from './dom-events'
import { freeze } from '../tools/object'

export type FileDropTextContent = {
  type: 'text'
  data: string
}

export type FileDropFilesContent = {
  type: 'files'
  data: File[]
}

export type FileDropContent = FileDropTextContent | FileDropFilesContent

export const isContentType = <T extends FileDropContent['type']>(
  content: FileDropContent,
  type: T
): content is Extract<FileDropContent, { type: T }> => content.type === type

export type FileDropEvents = {
  drop: FileDropContent
  enter: boolean
  over: boolean
  leave: boolean
}

const initialState = {
  active: false,
  count: 0
}

export type FileDropOptions = {
  target?: ListenerTarget
  mimeTypes: string[]
  maxSize?: number
}

export type FileDropState = {
  active: boolean
  count: number
}

export const createFileDrop = ({
  target = window,
  mimeTypes,
  maxSize = 1024 * 64
}: FileDropOptions) => {
  const instance = manager()
  const state = instance.use(shape<FileDropState>(initialState))
  const e = instance.use(events<FileDropEvents>())

  const reset = () => state.set(initialState)

  const dragenter = (event: DragEvent) =>
    filterEvent(event, (count) => {
      e.emit('enter', true)
      state.set({
        active: true,
        count
      })
    })

  const dragleave = (event: DragEvent) => {
    filterEvent(event, reset)
    e.emit('leave', true)
  }

  const dragover = (event: DragEvent) =>
    filterEvent(event, (count) => {
      e.emit('over', true)

      state.set({
        active: true,
        count
      })
    })

  const drop = (event: DragEvent) =>
    filterEvent(event, () => {
      reset()
      const result = getDropData(event)
      if (result) {
        e.emit('drop', result)
      }
    })

  const filterEvent = (event: DragEvent, fn: (count: number) => void) => {
    event.preventDefault()

    const text = event.dataTransfer?.getData('text/plain')
    const items = Array.from(event?.dataTransfer?.items || [])
    const types = items.map((i) => (i.kind === 'file' ? i.type : null)).filter(isNotNullish)

    if (
      !!event.dataTransfer &&
      mimeTypes.some((item) => types.includes(item)) &&
      items.length > 0
    ) {
      fn(items.length)
    } else if (text) {
      fn(1)
    } else {
      fn(0)
    }
  }

  const getDropData = (event: DragEvent): FileDropContent | void => {
    const text = event.dataTransfer?.getData('text/plain')
    const data = Array.from(event.dataTransfer?.files || [])
    const files = data.filter((file) => file.size <= maxSize)

    if (files.length > 0) {
      return {
        type: 'files',
        data: files
      }
    }
    if (text) {
      return {
        type: 'text',
        data: text
      }
    }
    return
  }

  instance.use(
    listen(target, {
      dragenter,
      dragleave,
      dragover,
      drop
    })
  )

  return freeze({
    dispose: instance.dispose,
    state,
    events: e
  })
}

export type FileDrop = Disposable & {
  state: Shape<FileDropState>
  events: Events<FileDropEvents>
}
