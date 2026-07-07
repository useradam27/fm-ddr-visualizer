//web worker entry point - runs in a separate thread


import { detectFormat, parseDDR, parseSaveAsXML} from '.index.js'

self.onmessage = async (e) => {
    const {type, xmlText} = e.data;

    if(type !== 'parse') return

    try {
        //strim UTF-8 BOM, some fm exports include it
        const cleanText = xmlText.replace(/^\uFEFF/, '');

        self.postMessage({type: 'progress', percent: 5, stage: 'Detecting format...'})
        const format = detectFormat(cleanText)

        if (format === 'unknown') {
            throw new Error('Unrecognized XML format')
        }

        self.postMessage({type: 'progress', percent: 10, stage: `Parsing ${format === 'ddr' ? 'DDR' : 'Save As XML'}...`})

        //pass the progress callback into the parser
        const reportProgress = (percent, stage) => {
            self.postMessage({type: 'progress', percent, stage})
        }

        const data = format === 'ddr' ? await parseDDR(cleanText, reportProgress) : await parseSaveAsXML(cleanText, reportProgress)
    } catch (err) {
        self.postMessage({type: 'error', message: err.message})
    }
}