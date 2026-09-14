import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDDRStore } from '../store/useDDRStore'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'


const TYPE_COLORS = {
    Text:        'blue',
    Number:      'green',
    Date:        'amber',
    Time:        'amber',
    Timestamp:   'amber',
    Container:   'purple',
    Calculation: 'rose',
    Summary:     'rose',
}

export default function TablesPage() {
    const { tableId } = useParams()
    const navigate = useNavigate()
    const {data} = useDDRStore()

    const [selectedFieldId, setSelectedFieldId] = useState(null)
    const [search, setSearch] = useState('')

    const tables = Object.values(data.tables).sort((a, b) => a.name.localeCompare(b.name))

    const activeTableId = tableId || tables[0]?.id
    const activeTable = data.tables[activeTableId]

    const fields = (activeTable?.fields || [])
        .map(fid => data.fields[fid])
        .filter(Boolean)
        .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

    const selectedField = selectedFieldId ? data.fields[selectedFieldId] : null

    return (
        <div className="flex h-full overflow-hidden">
            {/* Column 1 — tables */}
            <div className="w-52 bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0">
                <div className="p-3 border-b border-gray-800 sticky top-0 bg-gray-900">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Tables ({tables.length})
                </p>
                </div>
                {tables.map(table => (
                <button
                    key={table.id}
                    onClick={() => {
                    navigate(`/tables/${table.id}`)
                    setSelectedFieldId(null)
                    setSearch('')
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm border-b border-gray-800
                                transition-colors
                                ${table.id === activeTableId
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                    <p className="truncate">{table.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                    {table.fields.length} fields
                    </p>
                </button>
                ))}
            </div>
        
            {/* Column 2 — fields */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <PageHeader title={activeTable?.name || 'Tables'} count={fields.length} />
                <div className="p-3 border-b border-gray-800 shrink-0">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Filter fields..."
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5
                            text-sm text-gray-300 placeholder-gray-600
                            focus:outline-none focus:border-gray-500"
                />
                </div>
                <div className="flex-1 overflow-y-auto">
                {fields.length === 0
                    ? <EmptyState message="No fields match." />
                    : fields.map(field => (
                        <FieldRow
                        key={field.id}
                        field={field}
                        isSelected={field.id === selectedFieldId}
                        onClick={() => setSelectedFieldId(
                            field.id === selectedFieldId ? null : field.id
                        )}
                        />
                    ))}
                </div>
            </div>
        
            {/* Column 3 — field detail */}
            {selectedField && (
                <div className="w-80 border-l border-gray-800 overflow-y-auto shrink-0">
                    <FieldDetail field={selectedField} />
                </div>
            )}
        </div>
    )
}

function FieldRow({ field, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer
                  border-b border-gray-800 last:border-0 transition-colors
                  ${isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-gray-200 text-sm truncate">{field.name}</span>
        {field.options?.global && <Badge label="global" color="purple" />}
        {field.options?.required && <Badge label="required" color="amber" />}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {field.options?.repeats > 1 && (
          <Badge label={`×${field.options.repeats}`} color="gray" />
        )}
        <Badge
          label={field.dataType}
          color={TYPE_COLORS[field.dataType] || 'gray'}
        />
      </div>
    </div>
  )
}

function FieldDetail({ field }) {
  const { data } = useDDRStore()
  const navigate = useNavigate()
 
  const optionRows = [
    { label: 'Auto-enter', value: field.options?.autoEnter },
    { label: 'Global',     value: field.options?.global },
    { label: 'Required',   value: field.options?.required },
    { label: 'Unique',     value: field.options?.unique },
  ]
 
  const usedInScripts = field.usedInScripts || []
  const usedInLayouts = field.usedInLayouts || []
  const hasUsage = usedInScripts.length > 0 || usedInLayouts.length > 0
 
  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white break-words">{field.name}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {field.tableName} · {field.dataType} · {field.fieldType}
        </p>
      </div>
 
      <div className="grid grid-cols-2 gap-2">
        {optionRows.map(opt => (
          <div
            key={opt.label}
            className={`rounded p-2.5 border text-xs
              ${opt.value
                ? 'border-blue-800 bg-blue-900/20 text-blue-300'
                : 'border-gray-800 bg-gray-900 text-gray-600'}`}
          >
            {opt.label}
          </div>
        ))}
      </div>
 
      {field.options?.repeats > 1 && (
        <p className="text-sm text-gray-400">
          Repetitions: {field.options.repeats}
        </p>
      )}
 
      {field.comment && (
        <div className="bg-gray-900 border border-gray-800 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Comment</p>
          <p className="text-sm text-gray-300">{field.comment}</p>
        </div>
      )}
 
      {/* Used By — populated by buildIndex in Week 4 */}
      {hasUsage ? (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Used By</p>
          {usedInScripts.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">
                Scripts ({usedInScripts.length})
              </p>
              {usedInScripts.map(sid => {
                const s = data.scripts[sid]
                return s ? (
                  <button
                    key={sid}
                    onClick={() => navigate(`/scripts/${sid}`)}
                    className="block text-sm text-blue-400 hover:text-blue-300 text-left"
                  >
                    → {s.name}
                  </button>
                ) : null
              })}
            </div>
          )}
          {usedInLayouts.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-1">
                Layouts ({usedInLayouts.length})
              </p>
              {usedInLayouts.map(lid => {
                const l = data.layouts[lid]
                return l ? (
                  <p key={lid} className="text-sm text-gray-400">{l.name}</p>
                ) : null
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-600">
          Usage tracking coming soon.
        </p>
      )}
    </div>
  )
}

