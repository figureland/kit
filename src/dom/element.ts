import { isString } from '../tools'

export const isHTMLElement = (target?: unknown): target is HTMLElement =>
  target instanceof HTMLElement

export const getDataAttribute = (element: HTMLElement, propertyName: string): string | null => {
  const dataValue = element.dataset[propertyName]
  return isString(dataValue) ? dataValue : null
}
