import { useReducer, useState, useEffect, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos.js'
import { favouritesReducer, loadFavourites, STORAGE_KEY } from '../favouritesReducer.js'
import PhotoCard from './PhotoCard.jsx'
import Spinner from './Spinner.jsx'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [query, setQuery] = useState('')

  // Third argument lazily loads the initial state from localStorage.
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  // Persist favourites whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])

  // useCallback: keeps the same function reference between renders.
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', id })
  }, [])

  // useMemo: only re-filters when photos or query change, not on every render
  // (for example, when a heart is toggled).
  const filteredPhotos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return photos.filter((p) => p.author.toLowerCase().includes(q))
  }, [photos, query])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Photo Gallery</h1>

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by author name"
          aria-label="Search by author name"
          className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-800 focus:outline-none"
        />

        {loading && <Spinner />}

        {error && (
          <p role="alert" className="rounded-lg bg-red-100 p-4 text-red-800">
            Could not load photos: {error}. Check your connection and refresh the page.
          </p>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="py-10 text-center text-gray-600">No photos match that author name.</p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
