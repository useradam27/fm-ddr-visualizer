import { XMLParser } from "fast-xml-parser"
import { toArray } from "./utils"

import {parseFields } from './ddrParsers/parseFields'
import { parseScripts } from './ddrParsers/parseScripts'
import { parseLayouts }         from './ddrParsers/parseLayouts'
import { parseRelationships }   from './ddrParsers/parseRelationships'
import { parseValueLists }      from './ddrParsers/parseValueLists'
import { parseCustomFunctions } from './ddrParsers/parseCustomFunctions'
import { parsePrivileges }      from './ddrParsers/parsePrivileges'



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

  console.log('on file:', Object.keys(file))
  console.log('on root:', Object.keys(root))

  const fileName  = file['@_name']    || 'Unknown'
  const fmVersion = root['@_product'] || 'Unknown'

  onProgress?.(30, 'Parsing tables and fields...')
  const { tables, fields } = parseFields(file)

  onProgress?.(50, 'Parsing scripts...')
  const scripts = parseScripts(file)

  onProgress?.(65, 'Parsing layouts...')
  const layouts = parseLayouts(file, fields)
 
  onProgress?.(75, 'Parsing relationships...')
  const { occurrences, relationships } = parseRelationships(file)


  onProgress?.(85, 'Parsing value lists and functions...')
  const valueLists      = parseValueLists(file)
  const customFunctions = parseCustomFunctions(file)
  const privilegeSets   = parsePrivileges(file)


  
  // Attach occurrences back to their base tables
  const tableByName = {}
  Object.values(tables).forEach(t => { tableByName[t.name] = t })
  Object.values(occurrences).forEach(occ => {
    tableByName[occ.baseTable]?.occurrences.push(occ.id)
  })


  onProgress?.(100, 'Done')

  return {
    meta: {
      format: 'ddr',
      fmVersion,
      fileName,
      generatedAt: new Date().toISOString(),
    },
    tables,
    fields,
    scripts,
    layouts,
    occurrences,
    relationships,
    valueLists,
    customFunctions,
    privilegeSets,
    issues: [],
  }
}