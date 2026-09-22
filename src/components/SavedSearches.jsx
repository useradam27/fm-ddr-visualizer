import {useState, useEffect } from 'react'
import {useDDRStore} from '../store/useDDRStore'
import { getSavedSearches, saveSearch, deleteSavedSearch} from '../services/annotations'

export default function SavedSearches({ currentQuery, onSelect }) {
  const fileName = useDDRStore(state => state.fileName)
  const [searches, setSearches] = useState([])
  const [naming, setNaming]     = useState(false)
  const [name, setName]         = useState('')
 
  useEffect(() => {
    setSearches(getSavedSearches(fileName))
  }, [fileName])
 
  function handleSave() {
    if (!name.trim() || !currentQuery.trim()) return
    saveSearch(fileName, name.trim(), currentQuery)
    setSearches(getSavedSearches(fileName))
    setName('')
    setNaming(false)
  }
 
  function handleDelete(n) {
    deleteSavedSearch(fileName, n)
    setSearches(getSavedSearches(fileName))
  }
 
  if (searches.length === 0 && !currentQuery) return null
 
  return (
    <div className="px-3 pb-2 border-b border-gray-800">
      {searches.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {searches.map(s => (
            <span key={s.name} className="flex items-center gap-1">
              <button
                onClick={() => onSelect(s.query)}
                className="text-xs text-blue-400 hover:text-blue-300
                           bg-blue-900/20 border border-blue-900
                           rounded px-2 py-0.5"
              >
                {s.name}
              </button>
              <button
                onClick={() => handleDelete(s.name)}
                className="text-gray-700 hover:text-gray-400 text-xs"
                aria-label={`Delete saved search ${s.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
 
      {currentQuery && (
        naming ? (
          <div className="flex gap-1.5">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') setNaming(false)
              }}
              placeholder="Name this search"
              autoFocus
              className="flex-1 bg-gray-800 border border-gray-700 rounded
                         px-2 py-1 text-xs text-gray-300 placeholder-gray-600
                         focus:outline-none focus:border-gray-500"
            />
            <button onClick={handleSave}
                    className="text-xs text-green-400 hover:text-green-300">
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setNaming(true)}
            className="text-xs text-gray-600 hover:text-gray-400"
          >
            + Save this search
          </button>
        )
      )}
    </div>
  )
}

