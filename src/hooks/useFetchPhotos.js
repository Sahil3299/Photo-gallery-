import { useState, useEffect } from 'react'

const URL = 'https://picsum.photos/v2/list?limit=30'

// Fetches photos once on mount and returns { photos, loading, error }.
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false // avoids setting state if the component unmounted

    async function load() {
      try {
        const res = await fetch(URL)
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        const data = await res.json()
        if (!cancelled) setPhotos(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { photos, loading, error }
}
