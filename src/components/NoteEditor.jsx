import {useState, useEffect } from 'react'
import { useDDRStore } from '../store/useDDRStore'
import { getAnnotation, saveAnnotation } from '../services/annotations'

export default function NoteEditor({itemID}) {
    const fileName = useDDRStore(state => state.fileName)

    const [note, setNote] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [status, setStatus] = useState('')


    
    useEffect(() => {
        const ann = getAnnotation(fileName, itemID)
        setNote(ann.note || '')
        setTags(ann.tags || [])
        setTagInput('')
        setStatus('')
    }, [fileName, itemID])

    function persist(nextNote, nextTags) {
        const ok = saveAnnotation(fileName, itemID, {note: nextNote, tags: nextTags})
        setStatus(ok ? 'Saved successfully' : 'Failed to save')
        setTimeout(() => setStatus(''), 2000)
    }

    function addTag() {
        const t = tagInput.trim().toLowerCase()
        if (!t || tags.includes(t)) { setTagInput(''); return }
        const next = [...tags, t]
        setTags(next)
        setTagInput('')
        persist(note, next)
    }

    function removeTag(tag) {
        const next = tags.filter(t => t !== tag)
        setTags(next)
        persist(note, next)
    }

    return (
        <div className="border border-gray-800 rounded-lg p-3 bg-gray-900/50">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Notes & Tags
            </p>
        
            <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-blue-900/40
                            text-blue-300 border border-blue-800 px-2 py-0.5 rounded"
                >
                    {tag}
                    <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-200"
                    aria-label={`Remove tag ${tag}`}
                    >
                    ×
                    </button>
                </span>
                ))}
                <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                onBlur={addTag}
                placeholder="+ tag"
                className="text-xs bg-transparent border border-gray-700 rounded
                            px-2 py-0.5 text-gray-300 placeholder-gray-600 w-24
                            focus:outline-none focus:border-gray-500"
                />
            </div>
        
            <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                onBlur={() => persist(note, tags)}
                placeholder="Add a note..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2
                        text-sm text-gray-300 placeholder-gray-600 resize-none
                        focus:outline-none focus:border-gray-500"
            />
        
            <div className="h-4 mt-1">
                {status && (
                <span className={`text-xs ${status === 'Saved' ? 'text-green-500' : 'text-red-400'}`}>
                    {status}
                </span>
                )}
            </div>
        </div>
    )

}