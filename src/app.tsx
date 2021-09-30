import { render } from "react-dom"
import { observer } from "mobx-react-lite"

import "./styles/tw.css"
import "./styles/main.scss"

import BaseView from "./containers/BaseView"

import MainStore, { Context as MainStoreContext } from "./stores/main"
import { createStorageProvider } from "./helpers/storageProviders"
import { useEffect, useState } from "react"
import SessionStore from "./stores/session"

function initializeSyncStores() {
  const sessionStore = new SessionStore()

  sessionStore.init()
  sessionStore.makeObservable()

  return {
    sessionStore
  }
}

async function initializeAsyncStores() {
  const storageProvider = await createStorageProvider("local")
  const mainStore = new MainStore()

  mainStore.setStorageProvider(storageProvider)

  if (!(await mainStore.resurrect())) {
    mainStore.init()
    await mainStore.preserve()
  }

  mainStore.makeObservable()

  return {
    storageProvider,
    mainStore
  }
}

const Main = observer(() => {
  const { sessionStore } = initializeSyncStores()

  const [mainStore, setMainStore] = useState<InstanceType<typeof MainStore>>(null)

  useEffect((async () => {
    const stores = await initializeAsyncStores()

    setMainStore(stores.mainStore)

    sessionStore.setLoadComplete(true)
  }) as any, [])

  return (
    <>
      <MainStoreContext.Provider value={mainStore}>
        <BaseView />
      </MainStoreContext.Provider>

      {!sessionStore.loadComplete ? (
        <>
          <div className="flex flex-col items-center justify-center w-screen h-screen p-4 bg-black bg-opacity-90 fixed top-0 left-0 z-[100000]">
            <div className="p-6 rounded-xl bg-white min-w-96">
              Hi
            </div>
          </div>
        </>
      ) : (<></>)}
    </>
  )
})

render(<Main />, document.getElementById("app-root"));
