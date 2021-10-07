type AnyObject = { [x in any]: any }

export default function copyToObject<P extends AnyObject, N extends keyof P & string, T extends AnyObject>(source: P, key: N | N[], target: T): target is T & { [x in N]: P[N] } {
  if (typeof key === "string") {
    target[key] = source[key]
  } else {
    for (const i of key) {
      target[i] = source[i]
    }
  }

  return true
}
