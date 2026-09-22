import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDDRStore } from '../store/useDDRStore'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import NoteEditor from '../components/NoteEditor'
import SavedSearches from '../components/SavedSearches'


export default function ScriptsPage() {
    const { scriptId } = useParams()
    const navigate = useNavigate()
    const { data } = useDDRStore()
    const [search, setSearch] = useState('')

    const allScripts = data.scripts
    const scripts = useMemo(() => Object.values(allScripts).sort((a,b) => a.name.localeCompare(b.name)),[allScripts])


    const folders = useMemo(() => {
        const map = {}
        scripts.forEach(s => {
            const key = s.folder || '(No Folder)'
            if (!map[key]) {
                map[key] = []
            }
            map[key].push(s)
        })
        return map
    }, [scripts])

    const filtered = search ? scripts.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) : null

    const activeScript = scriptId ? allScripts[scriptId] : null

    return (
        <div className="flex h-full overflow-hidden">
            {/* Script list */}
            <div className="w-64 bg-gray-900 border-r border-gray-800
                            flex flex-col overflow-hidden shrink-0">
                <div className="p-3 border-b border-gray-800 shrink-0">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={`Search ${scripts.length} scripts...`}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5
                            text-sm text-gray-300 placeholder-gray-600
                            focus:outline-none focus:border-gray-500"
                />
                </div>

                <SavedSearches currentQuery={search} onSelect={setSearch} />

        
                <div className="flex-1 overflow-y-auto">
                {filtered
                    ? (filtered.length === 0
                        ? <EmptyState message="No matches." />
                        : filtered.map(s => (
                            <ScriptListItem
                            key={s.id}
                            script={s}
                            isActive={s.id === scriptId}
                            onClick={() => navigate(`/scripts/${s.id}`)}
                            />
                        )))
                    : Object.entries(folders)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([folder, list]) => (
                        <div key={folder}>
                            <div className="px-3 py-1.5 text-xs text-gray-600 bg-gray-900
                                            border-b border-gray-800 uppercase tracking-wider
                                            sticky top-0">
                            {folder} ({list.length})
                            </div>
                            {list.map(s => (
                            <ScriptListItem
                                key={s.id}
                                script={s}
                                isActive={s.id === scriptId}
                                onClick={() => navigate(`/scripts/${s.id}`)}
                            />
                            ))}
                        </div>
                        ))}
                </div>
            </div>
        
            {/* Script detail */}
            <div className="flex-1 overflow-y-auto">
                {activeScript
                ? <ScriptDetail
                    script={activeScript}
                    allScripts={allScripts}
                    format={data.meta.format}
                    onNavigate={id => navigate(`/scripts/${id}`)}
                    />
                : <div className="p-8 text-gray-600 text-sm">
                    Select a script to view its steps.
                    </div>}
            </div>
        </div>

    )

}

function ScriptListItem({ script, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 text-sm border-b border-gray-800
                  transition-colors
                  ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
    >
      <p className="truncate">{script.name}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-gray-600">{script.steps.length} steps</span>
        {script.steps.length === 0 && <Badge label="empty" color="amber" />}
      </div>
    </button>
  )
}

function ScriptDetail({ script, allScripts, format, onNavigate }) {
  const [view, setView] = useState('steps')
  const hasSource = Boolean(script.source)
 
  const disabledCount = script.steps.filter(s => !s.enabled).length
 
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white break-words">{script.name}</h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
          {script.folder && <span>{script.folder}</span>}
          <span>{script.steps.length} steps</span>
          {disabledCount > 0 && (
            <span className="text-gray-600">{disabledCount} disabled</span>
          )}
        </div>
      </div>
 
      {/* Cross-links — populated by buildIndex in Week 4 */}
      <ScriptLinks script={script} allScripts={allScripts} onNavigate={onNavigate} />
 
      {/* View toggle — only meaningful when source exists */}
      {hasSource && (
        <div className="flex gap-1 border-b border-gray-800">
          {['steps', 'source'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs border-b-2 transition-colors
                ${view === v
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {v === 'steps' ? 'Steps' : 'Source'}
            </button>
          ))}
        </div>
      )}
 
      {view === 'source' && hasSource ? (
        <pre className="bg-gray-900 border border-gray-800 rounded p-4 text-xs
                        text-gray-300 overflow-x-auto whitespace-pre-wrap
                        leading-relaxed">
          {script.source}
        </pre>
      ) : (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          {script.steps.length === 0
            ? <EmptyState message="This script has no steps." />
            : script.steps.map((step, i) => (
                <StepRow key={i} step={step} index={i + 1} />
              ))}
        </div>
      )}
 
      {!hasSource && format === 'ddr' && script.steps.length > 0 && (
        <p className="text-xs text-gray-600">
          Full script source is only available in Save-As-XML exports.
        </p>
      )}
      <NoteEditor itemID={script.id} />
    </div>
  )
}
 
function StepRow({ step, index }) {
  return (
    <div className={`flex items-start gap-3 py-1.5 px-4 text-sm
                     border-b border-gray-800/50 last:border-0
                     ${!step.enabled ? 'opacity-40' : ''}`}>
      <span className="text-gray-700 text-xs mt-0.5 w-6 shrink-0 text-right">
        {index}
      </span>
      <span className="text-gray-300 flex-1">{step.name}</span>
      {!step.enabled && <Badge label="disabled" color="gray" />}
    </div>
  )
}
 
function ScriptLinks({ script, allScripts, onNavigate }) {
  const calls    = script.callsScripts || []
  const calledBy = script.calledByScripts || []
  if (calls.length === 0 && calledBy.length === 0) return null
 
  const renderList = (ids, prefix) => ids.map(id => {
    const s = allScripts[id]
    return s ? (
      <button
        key={id}
        onClick={() => onNavigate(id)}
        className="block text-sm text-blue-400 hover:text-blue-300 text-left"
      >
        {prefix} {s.name}
      </button>
    ) : null
  })
 
  return (
    <div className="grid grid-cols-2 gap-4">
      {calls.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Calls
          </p>
          {renderList(calls, '→')}
        </div>
      )}
      {calledBy.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Called By
          </p>
          {renderList(calledBy, '←')}
        </div>
      )}
    </div>
  )
}

