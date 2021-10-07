export const PROVIDER_NAME = "ServerStorage"

export async function saveNamed<T extends any>(name: string, data: T): Promise<boolean> {
  const stringData = JSON.stringify(data)

  // TODO!!!

  return false
}

export async function loadNamed<T extends any>(name: string): Promise<T> {
  // TODO!!!

  const data = JSON.parse("")
  return data
}
