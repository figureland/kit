import { type Events, type SignalRecord, events, record, type Disposable, system } from '../state'
import { isNotNullish } from '../type'
import { createListener, type ListenerTarget } from '../dom/events'

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
  const { use, dispose } = system()
  const state = use(record<FileDropState>(initialState))
  const e = use(events<FileDropEvents>())

  const reset = () => state.set(initialState)

  const onDragEnter = (event: DragEvent) =>
    filterEvent(event, (count) => {
      e.emit('enter', true)
      state.set({
        active: true,
        count
      })
    })

  const onDragLeave = (event: DragEvent) => {
    filterEvent(event, reset)
    e.emit('leave', true)
  }

  const onDragOver = (event: DragEvent) =>
    filterEvent(event, (count) => {
      e.emit('over', true)

      state.set({
        active: true,
        count
      })
    })

  const onDrop = (event: DragEvent) =>
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

  use(e)
  use(createListener(target, 'dragenter', onDragEnter))
  use(createListener(target, 'dragleave', onDragLeave))
  use(createListener(target, 'dragover', onDragOver))
  use(createListener(target, 'drop', onDrop))

  return {
    dispose,
    state,
    events: e
  }
}

export type FileDrop = Disposable & {
  state: SignalRecord<FileDropState>
  events: Events<FileDropEvents>
}
