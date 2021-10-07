import * as localStorage from "./local"
import * as serverStorage from "./server"

const Providers = {
  local: localStorage,
  server: serverStorage
}

export interface StorageAdapter {
  PROVIDER_NAME: string

  testConnection?(): boolean | Promise<boolean>
  saveNamed<T>(name: string, data: T): boolean | Promise<boolean>
  loadNamed<T>(name: string): T | Promise<T>
}

export async function createStorageProvider(type: keyof typeof Providers): Promise<StorageAdapter> {
  let provider = Providers[type] as StorageAdapter

  let connectionOk = provider.testConnection ? await provider.testConnection() : true
  if (!connectionOk) return null

  return provider
}
