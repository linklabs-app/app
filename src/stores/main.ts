import { ExtendStore, Tuple } from "./generic"
import { APP_VERSION } from "../constants"

const MainStore = ExtendStore(class {
  public static STORE_NAME = "main"
  public static STORE_VERSION = 1

  public static PRESERVED_KEYS = Tuple()

  public isShowingLoading = false
  toggleShowingLoading() {
    this.isShowingLoading = !this.isShowingLoading
  }
})

export default MainStore

export const Context = MainStore.getContext()
