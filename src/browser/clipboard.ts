import { type State, type Disposable, type Events, store, state, events } from '../state'
import { listen } from '../browser/dom-events'
import { isString } from '../tools/guards'
import { freeze, values } from '../tools/object'
import { settle } from '../tools/async'
import {
  blobToData,
  blobToHTML,
  blobToImage,
  dataToBlob,
  htmlToBlob,
  imageToBlob,
  mimeTypes,
  type DataBlobContent,
  type HTMLBlobContent,
  type ImageBlobContent
} from '../browser/blob'

export type ClipboardEntry = {
  data?: DataBlobContent
  html?: HTMLBlobContent
  image?: ImageBlobContent
}

const has = <C extends ClipboardEntry, T extends string & keyof C, R extends Required<C>>(
  e: C,
  type: T
): e is R => isString(type) && `${type}` in e && !!e[type]

export const createClipboardItems = async (entries: ClipboardEntry[]): Promise<ClipboardItem[]> =>
  settle(
    entries.map(
      async (e) =>
        new ClipboardItem({
          ...(has(e, 'html') && { [mimeTypes.html]: await htmlToBlob(e.html) }),
          ...(has(e, 'data') && { [mimeTypes.data]: await dataToBlob(e.html) }),
          ...(has(e, 'image') && { [mimeTypes.image]: await imageToBlob(e.image) })
        })
    )
  ).then(({ fulfilled }) => fulfilled)

const parsers = {
  [mimeTypes.html]: blobToHTML,
  [mimeTypes.data]: blobToData,
  [mimeTypes.image]: blobToImage
}

export const parseClipboardItem = (item: ClipboardItem) =>
  settle(
    values(mimeTypes)
      .filter((t) => item.types.includes(t))
      .map(async (type) => {
        const blob = await item.getType(type)
        const data = await parsers[type](blob)
        return {
          type,
          data,
          size: blob.size
        }
      })
  ).then(({ fulfilled }) => fulfilled)

export type ParsedClipboardItem = Awaited<ReturnType<typeof parseClipboardItem>>

export const supportsClipboard = (): boolean => 'navigator' in navigator && 'clipboard' in navigator

export type ParsedClipboardEvent = ParsedClipboardData & { event: ClipboardEvent }

export type ClipboardEvents = {
  copy: ParsedClipboardEvent
  cut: ParsedClipboardEvent
  paste: ParsedClipboardEvent
}

const getClipboardData = async () => {
  const items = await navigator.clipboard.read()
  const text = await navigator.clipboard.readText()

  const { fulfilled } = await settle(items.map(parseClipboardItem))

  return {
    items: fulfilled,
    text
  }
}

export type ParsedClipboardData = {
  items: ParsedClipboardItem[]
  text: string
}

export const createClipboard = (): Clipboard => {
  const instance = store()
  const available = instance.use(state(supportsClipboard))

  const e = events<ClipboardEvents>()

  const emit = async (type: keyof ClipboardEvents, event: ClipboardEvent) => {
    const data = await getClipboardData()

    if (data.items.length > 0) {
      e.emit(type, { ...data, event })
    }
  }

  const handleCopy = (e: ClipboardEvent) => emit('copy', e)
  const handleCut = (e: ClipboardEvent) => emit('cut', e)
  const handlePaste = (e: ClipboardEvent) => emit('paste', e)

  const copy = async (values: ClipboardEntry[] = []) => {
    if (available.get()) {
      const data = await createClipboardItems(values)
      await navigator!.clipboard.write(data)
    }
  }

  const read = async () => {
    if (available.get()) {
      return await getClipboardData()
    }
  }

  instance.use(
    listen(window, {
      copy: handleCopy,
      cut: handleCut,
      paste: handlePaste
    })
  )

  return freeze({
    events: e,
    copy,
    read,
    available,
    dispose: instance.dispose
  })
}

export type Clipboard = Disposable & {
  events: Events<ClipboardEvents>
  copy: (items: ClipboardEntry[]) => Promise<void>
  available: State<boolean>
  read: () => Promise<ParsedClipboardData | undefined>
}
