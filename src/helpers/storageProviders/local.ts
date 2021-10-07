import { APP_PREFIX } from "../../constants"

export const PROVIDER_NAME = "LocalStorage"

export function testConnection(): boolean {
  return !!window.localStorage
}

export function saveNamed<T extends any>(name: string, data: T): boolean {
  const stringData = JSON.stringify(data)
  localStorage.setItem(APP_PREFIX + name, stringData)

  return true
}

export function loadNamed<T extends any>(name: string): T {
  const stringData = localStorage.getItem(APP_PREFIX + name)
  if (!stringData) return null

  const data = JSON.parse(stringData)
  return data
}
