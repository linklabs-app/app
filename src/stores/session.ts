import { ExtendStore, Tuple } from "./generic"
import { APP_VERSION } from "../constants"

const SessionStore = ExtendStore(class {
  public static STORE_NAME = "session"
  public static STORE_VERSION = 1

  public loadComplete = false
  setLoadComplete(value: boolean) {
    this.loadComplete = value
  }
})

export default SessionStore

export const Context = SessionStore.getContext()
