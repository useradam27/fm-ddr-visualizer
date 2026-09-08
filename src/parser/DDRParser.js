import { XMLParser } from "fast-xml-parser"
import { toArray } from "./utils"

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  trimValues: true,
})

export async function parseDDR(xmlText, onProgress) {
  onProgress?.(20, 'Parsing DDR file...')

  let doc
  try {
    doc = xmlParser.parse(xmlText)
  } catch (err) {
    throw new Error('Invalid DDR XML — is this a FileMaker DDR file?')
  }

  // Root element name varies by FM version
  const root = doc.FMPReport || {}
  const file = toArray(root.File)[0] || {}

  const fileName  = file['@_name']    || 'Unknown'
  const fmVersion = root['@_product'] || 'Unknown'

  onProgress?.(80, 'Building data model...')
  onProgress?.(100, 'Done')

  return {
    meta: {
      format: 'ddr',
      fmVersion,
      fileName,
      generatedAt: new Date().toISOString(),
    },
    tables: {},
    fields: {},
    scripts: {},
    layouts: {},
    relationships: [],
    valueLists: {},
    customFunctions: {},
    privilegeSets: {},
    issues: [],
  }
}