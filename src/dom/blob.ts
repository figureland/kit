import { isString } from '../type'
import { fit, size } from '../math/size'

const { stringify, parse } = JSON

export type SVGBlobContent = string | SVGElement

export const mimeTypes = {
  image: 'image/png',
  data: 'text/plain',
  html: 'text/html'
} as const

export const serializeElement = async (element: HTMLElement): Promise<string> =>
  new XMLSerializer().serializeToString(element)

export type ImageBlobContent = string | HTMLImageElement

export const imageToBlob = async (src: ImageBlobContent): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = isString(src) ? document.createElement('img') : src

    if (isString(src)) {
      img.src = src
    }

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas')
        const resized = fit(canvas, size(4096, 4096))
        canvas.width = resized.width
        canvas.height = resized.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(async (blob) => {
            if (!blob) {
              throw new Error('Failed to generate image blob')
            } else {
              resolve(blob)
            }
          }, mimeTypes.image)
        }
      } catch (e) {
        reject(e)
      }
    }

    img.onerror = (e) => reject(e)
  })

export const blobToImage = async (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      resolve(URL.createObjectURL(blob))
    } catch {
      reject(new Error(`Could not create object URL from blob`))
    }
  })

export type DataBlobContent = unknown

export const dataToBlob = async (content: DataBlobContent) =>
  new Blob([stringify(content)], { type: mimeTypes.data })

export const blobToData = async (blob: Blob): Promise<unknown> => {
  const text = await blob.text()
  try {
    const result = parse(text)
    return result
  } catch (e) {
    if (e instanceof SyntaxError) {
      return text
    } else {
      throw e
    }
  }
}

export type HTMLBlobContent = string | HTMLElement

export const htmlToBlob = async (content: HTMLBlobContent) =>
  new Blob([isString(content) ? content : await serializeElement(content)], {
    type: mimeTypes.html
  })

export const blobToHTML = async (blob: Blob): Promise<string> => blob.text()
