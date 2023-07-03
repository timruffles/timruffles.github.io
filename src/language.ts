export function attempt<T>(fn: () => T): T | Error {
  try {
    return fn()
  } catch (e) {
    return e
  }
}
