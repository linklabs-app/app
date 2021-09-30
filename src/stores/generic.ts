import { Context, createContext } from "react"
import { makeAutoObservable } from "mobx"
import copyToObject from "../helpers/copyToObject"
import { StorageAdapter } from "../helpers/storageProviders"

type AnyObject<K extends string | number | symbol = any, V = any> = { [x in K]: V }

class GenericStore {
  public init() {

  }

  public setStorageProvider(provider) {
    (this as any).__STORAGE_PROVIDER = provider
  }

  public makeObservable() {
    makeAutoObservable(this)
  }

  public static loadOrInit(t: any): any {
    let instance = new t(false)

    if (!instance.resurrect()) {
      instance.init(true)
      instance.preserve()
    }

    return instance
  }

  public async preserve() {
    if (!(this as any).__STORAGE_PROVIDER || !(this as any).__PRESERVED_KEYS || (this as any).__PRESERVED_KEYS.length === 0) return false

    const dataToSave = {
      __STORE_VERSION: (this as any).__STORE_VERSION
    }

    if (copyToObject(this, (this as any).__PRESERVED_KEYS, dataToSave)) {
      await (this as any).__STORAGE_PROVIDER.saveNamed((this as any).__STORE_NAME, dataToSave)

      return true
    }

    return false
  }

  public async resurrect(): Promise<boolean> {
    if (!(this as any).__STORAGE_PROVIDER || !(this as any).__PRESERVED_KEYS || (this as any).__PRESERVED_KEYS.length === 0) return false

    const dataFromLocalStorage = await (this as any).__STORAGE_PROVIDER.loadNamed((this as any).__STORE_NAME)

    if (!dataFromLocalStorage) return false

    if ((this as any).__STORE_VERSION && (this as any).__STORE_VERSION < dataFromLocalStorage.__STORE_VERSION) {
      console.warn("WARNING: Data from localStorage was created by a newer version of this application. Might encounter errors.")
    }

    for (const key in dataFromLocalStorage) {
      const value = dataFromLocalStorage[key]

      this[key] = value
    }

    return true
  }
}


type Constructor<M> = {
  new(...args: any[]): M
}

type Instance<C extends Constructor<any>> = C extends Constructor<infer M> ? M : never;

type PKConstructor<M, P> = {
  new(...args: any[]): M,
  STORE_NAME: string,
  STORE_VERSION: number,
  PRESERVED_KEYS?: P,
}

interface Tx<M, P> {
  new(...args: any[]): M
  loadOrInit(): M
  getContext(): Context<M>
}

interface Mx<M> {
  init(): void
  setStorageProvider(provider: StorageAdapter): void
  makeObservable(): void
  preserve(): Promise<boolean>
  resurrect(): Promise<boolean>
}

export function ExtendStore<
  T extends PKConstructor<any, (keyof M)[]>,
  M extends Instance<T>,
  P extends keyof M
>(t: T): T & Tx<M & Mx<M>, P> {
  (t as any).loadOrInit = function () {
    return GenericStore.loadOrInit(t)
  };

  (t as any).getContext = function () {
    return createContext(null)
  };

  (t as any).prototype.__PRESERVED_KEYS = [...t.PRESERVED_KEYS];
  (t as any).prototype.__STORE_NAME = t.STORE_NAME;
  (t as any).prototype.__STORE_VERSION = t.STORE_VERSION;

  if (!t.prototype.init) t.prototype.init = function (...a) { return (GenericStore.prototype.init).apply(this, ...a) }
  t.prototype.setStorageProvider = function (...a) { return GenericStore.prototype.setStorageProvider.apply(this, ...a) }
  t.prototype.makeObservable = function (...a) { return GenericStore.prototype.makeObservable.apply(this, ...a) }
  t.prototype.preserve = function (...a) { return GenericStore.prototype.preserve.apply(this, ...a) }
  t.prototype.resurrect = function (...a) { return GenericStore.prototype.resurrect.apply(this, ...a) }

  return t as any
}

export function Tuple<T extends string[]>(...args: T): T {
  return args
}

