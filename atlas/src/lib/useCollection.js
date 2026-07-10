import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

// Load a backend collection and persist edits.
// `save` writes the full document to the JSON file via the Express API,
// updating local state optimistically.
export function useCollection(name) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .get(name)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
    return () => {
      alive = false
    }
  }, [name])

  const save = useCallback(
    async (next) => {
      const value = typeof next === 'function' ? next(data) : next
      setData(value)
      try {
        await api.put(name, value)
      } catch (e) {
        setError(e)
      }
      return value
    },
    [name, data]
  )

  return { data, save, error, loading: data === null && !error }
}
