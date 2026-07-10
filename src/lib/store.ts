import { useCallback, useSyncExternalStore } from 'react'

// Tiny localStorage-backed store for user-generated demo content
// (board posts, advice entries, talk offers, newsletter leads).
// The API shape mirrors what a Firestore swap would need.

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

const cache = new Map<string, unknown[]>()

function read<T>(key: string): T[] {
  if (!cache.has(key)) {
    try {
      const raw = localStorage.getItem(`catlab:${key}`)
      cache.set(key, raw ? JSON.parse(raw) : [])
    } catch {
      cache.set(key, [])
    }
  }
  return cache.get(key) as T[]
}

function write<T>(key: string, items: T[]) {
  cache.set(key, items)
  localStorage.setItem(`catlab:${key}`, JSON.stringify(items))
  emit()
}

export function useCollection<T>(key: string, seed: T[] = []) {
  const subscribe = useCallback((cb: Listener) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }, [])

  const getSnapshot = useCallback(() => {
    const stored = read<T>(key)
    return stored.length ? stored : seed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const items = useSyncExternalStore(subscribe, getSnapshot)

  const add = useCallback(
    (item: T) => {
      const current = read<T>(key)
      // first write folds the seed in so seeded content persists
      write(key, [item, ...(current.length ? current : seed)])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  return { items, add }
}

let counter = 0
export function newId(prefix: string) {
  counter += 1
  return `${prefix}-${Date.now()}-${counter}`
}
