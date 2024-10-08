import { isValidURL } from '../../tools/guards'

export const getFile = async (url: string): Promise<ArrayBuffer> => {
  if (!isValidURL(url)) {
    throw new Error(`Invalid URL: ${url}`)
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load file from ${url}: ${response.statusText}`)
  }
  return response.arrayBuffer()
}
