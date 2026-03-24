import { useCallback, useDeferredValue } from "react";
import { useDDRStore } from "../store/useDDRStore";
import { parseDDR } from '../parser/DDRParser'

export default function UploadPage() {
    const { setData, setLoading, setError } = useDDRStore()

    //catch incorrect file
    const handleFile = useCallback(async (file) => {
        if (!file || !file.name.endsWith('.xml')) {
            setError('Please upload a FileMaker DDR XML file.')
            return
        }

        setLoading(true)

        try {
            const text = await file.text()
            const result = parseDDR(text)
            setData(result, file.name)
        } catch (err) {
            setError(`Failed to parse DRR: ${err.message}`)
        }
    }, [setData, setLoading,setError])


    const handleDrop = useCallback((e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }, [handleFile])
    
    const handleInputChange = useCallback((e) => {
        handleFile(e.target.files[0])
    }, [handleFile])
    
    const { isLoading, error } = useDDRStore()
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">FM DDR Visualizer</h1>
            <p className="text-gray-400">
              Upload your FileMaker Database Design Report XML to explore your solution.
            </p>
          </div>
    
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full max-w-lg border-2 border-dashed border-gray-600 rounded-xl p-16 text-center
                       hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
          >
            {isLoading ? (
              <p className="text-blue-400 animate-pulse">Parsing DDR...</p>
            ) : (
              <>
                <p className="text-gray-300 text-lg mb-2">Drop your DDR XML here</p>
                <p className="text-gray-500 text-sm">or click to browse</p>
              </>
            )}
          </div>
    
          <input
            id="file-input"
            type="file"
            accept=".xml"
            className="hidden"
            onChange={handleInputChange}
          />
    
          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
    
          <div className="mt-8 text-gray-600 text-xs text-center max-w-md">
            <p>Your file never leaves your browser. All processing happens locally.</p>
            <p className="mt-1">
              To generate a DDR: FileMaker → Tools → Database Design Report → XML
            </p>
          </div>
        </div>
      )
}