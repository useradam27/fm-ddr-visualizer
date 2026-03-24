import { useDDRStore } from '../store/useDDRStore'

export default function OverviewPage() {
  const { data, fileName, reset } = useDDRStore()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{data.meta.fileName}</h1>
          <p className="text-gray-400 text-sm">FileMaker {data.meta.fmVersion}</p>
        </div>
        <button
          onClick={reset}
          className="text-gray-400 hover:text-white text-sm border border-gray-700 
                     px-3 py-1 rounded hover:border-gray-500 transition-colors"
        >
          ← Load different file
        </button>
      </div>
      <p className="text-gray-400">Parser connected. Summary coming Day 5.</p>
    </div>
  )
}