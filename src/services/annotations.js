

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
        //quota exceeded or storage disabled
        console.warn('Could not save to localStorage:', err)
        return false
    }
}

const annKey = (fileName) => `fmddr_annotations_${fileName}`

export function getAnnotations(fileName) {
    return read(annKey(fileName), {})
}

export function getAnnotation(fileName, itemId) {
    return getAnnotations(fileName)[itemId] || {note: '', tags: []}
}

export function saveAnnotation(fileName, itemId, {note, tags}) {
    const all = getAnnotations(fileName)

    //drop empty annotations
    if(!note.trim() && (!tags || tags.length === 0)) {
        delete all[itemId]
    } else {
        all[itemId] = {note: note ?? '', tags: tags ?? []}
    }

    return write(annKey(fileName), all)
}

const searchKey = (fileName) => `fmddr_search_${fileName}`

export function getSavedSearches(fileName) {
    return read(searchKey(fileName), [])
}

export function saveSearch(fileName, name, query) {
    const searches = getSavedSearches(fileName).filter(s => s.name !== name)
    searches.push({name, query})
    return write(searchKey(fileName), searches)
}

export function deleteSavedSearch(fileName, name) {
    const searches = getSavedSearches(fileName).filter(s => s.name !== name)
    return write(searchKey(fileName), searches)
}