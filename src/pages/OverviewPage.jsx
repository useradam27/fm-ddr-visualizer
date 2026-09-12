import { useDDRStore } from '../store/useDDRStore'


function StatCard({ label, count, color = 'blue' }) {
    const styles = {
      blue:   'border-blue-800 text-blue-400',
      teal:   'border-teal-800 text-teal-400',
      purple: 'border-purple-800 text-purple-400',
      green:  'border-green-800 text-green-400',
      amber:  'border-amber-800 text-amber-400',
      rose:   'border-rose-800 text-rose-400',
  }

  return (
    <div className={`border ${styles[color]} rounded-lg p-5 bg-gray-900`}>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{count.toLocaleString()}</p>
    </div>
  )
}

export default function OverviewPage() {
  const { data, reset } = useDDRStore()
  const {
    meta, tables, fields, scripts, layouts, relationships, valueLists, customFunctions, privilegeSets,
  } = data

  const isSaveAsXml = meta.format === 'saveAsXml'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{meta.fileName}</h1>
            <span className={`text-xs px-2 py-0.5 rounded border
              ${isSaveAsXml
                ? 'bg-purple-900/40 text-purple-300 border-purple-800'
                : 'bg-blue-900/40 text-blue-300 border-blue-800'
              }`}>
              {isSaveAsXml ? 'Save-As-XML' : 'DDR'}
            </span>
          </div>
          <p className="text-gray-400 mt-1">
            FileMaker {meta.fmVersion}
            {meta.xmlFormat && ` · XML format ${meta.xmlFormat}`}
            {' · '}
            Analyzed {new Date(meta.generatedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={reset}
          className="text-gray-400 hover:text-white text-sm border border-gray-700
                     px-3 py-1.5 rounded hover:border-gray-500 transition-colors"
        >
          ← Load different file
        </button>
      </div>
 
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Tables"           count={Object.keys(tables).length}          color="blue"   />
        <StatCard label="Fields"           count={Object.keys(fields).length}          color="teal"   />
        <StatCard label="Scripts"          count={Object.keys(scripts).length}         color="purple" />
        <StatCard label="Layouts"          count={Object.keys(layouts).length}         color="green"  />
        <StatCard label="Relationships"    count={relationships.length}                color="amber"  />
        <StatCard label="Value Lists"      count={Object.keys(valueLists).length}      color="rose"   />
        <StatCard label="Custom Functions" count={Object.keys(customFunctions).length} color="blue"   />
        <StatCard label="Privilege Sets"   count={Object.keys(privilegeSets).length}   color="teal"   />
      </div>
 
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-white font-semibold mb-4">Tables</h2>
        {Object.values(tables).length === 0 ? (
          <p className="text-gray-600 text-sm">No tables found in this file.</p>
        ) : (
          Object.values(tables).map(table => (
            <div
              key={table.id}
              className="flex items-center justify-between py-2
                         border-b border-gray-800 last:border-0"
            >
              <span className="text-gray-200">{table.name}</span>
              <span className="text-gray-500 text-sm">
                {table.fields.length} fields · {table.occurrences.length} occurrences
              </span>
            </div>
          ))
        )}
      </div>
 
      <p className="mt-8 text-gray-600 text-sm text-center">
        Full navigation coming in Week 3.
      </p>
    </div>
  )
}