import { XMLParser } from "fast-xml-parser"
import { toArray } from "./utils"

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  trimValues: true,
})


// Temp parser to not throw error, to be fully implemented
export async function parseSaveAsXML(xmlText, onProgress) { 
    onProgress?.(50, 'Save-As-XML parser not yet implemented')


    let doc
    try {
        doc = xmlParser.parse(xmlText)
    } catch (err) {
        throw new Error('Invalid XML — is this a FileMaker Save-As-XML file?')
    }

    const root = doc.FMSaveAsXML || {}
    const file = toArray(root.File)[0] || {}

    const fileName  = root['@_source'] || file['@_name'] || 'Unknown'
    const fmVersion = root['@_product'] || 'Unknown'

    onProgress?.(80, 'Building data model...')
    onProgress?.(100, 'Done')

    return {
        meta: {
            format: 'saveAsXml',
            fmVersion,
            fileName,
            generatedAt: new Date().toISOString(),
        },
        tables: {}, fields: {}, scripts: {}, layouts: {},
        occurrences: {}, relationships: [],
        valueLists: {}, customFunctions: {}, privilegeSets: {},
        issues: [],
    }
}