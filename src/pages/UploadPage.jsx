import { useCallback } from "react";
import { useDDRStore } from "../store/useDDRStore";
import { parseDDR } from '../parser/DDRParser'

export default function UploadPage() {
    const { setData, setLoading, setError, setProgress, isLoading, progress, progressStage, error } = useDDRStore()

    //catch incorrect file
    const handleFile = useCallback(async (file) => {
        if (!file || !file.name.endsWith('.xml')) {
            setError('Please upload a FileMaker DDR XML file.')
            return
        }

        setLoading(true)

        try {
            const text = await file.text()
            const result = await parseDDR(text, (percent, stage) => {
                setProgress(percent, stage)
            })
            setData(result, file.name)
        } catch (err) {
            setError(`Failed to parse DRR: ${err.message}`)
        }
    }, [setData, setLoading,setError, setProgress])


    const handleDrop = useCallback((e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }, [handleFile])
    
    const handleInputChange = useCallback((e) => {
        handleFile(e.target.files[0])
    }, [handleFile])
    
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">FM DDR Visualizer</h1>
            <p className="text-gray-400">
              Upload your FileMaker XML to explore your solution.
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
              <div className="w-full">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-400 text-sm">{progressStage || 'Parsing...'}</p>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-600 text-xs">{progress}%</p>
              </div>
            ) : (
              <>
                <p className="text-gray-300 text-lg mb-2">Drop your FileMaker XML here</p>
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
            <p className="mt-2">Generate from FileMaker:</p>
            <p>DDR: Tools → Database Design Report → XML</p>
            <p>Save-As-XML: File → Save a Copy as → XML</p>
          </div>
        </div>
      )
}