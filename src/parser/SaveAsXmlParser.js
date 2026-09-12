import { XMLParser } from "fast-xml-parser"
import { toArray } from "./utils"

import { parseSaxBaseTables }      from './saxParsers/parseSaxBaseTables'
import { parseSaxScripts }         from './saxParsers/parseSaxScripts'
import { parseSaxLayouts }         from './saxParsers/parseSaxLayouts'
import { parseSaxRelationships }   from './saxParsers/parseSaxRelationships'
import { parseSaxValueLists }      from './saxParsers/parseSaxValueLists'
import { parseSaxCustomFunctions } from './saxParsers/parseSaxCustomFunctions'
import { parseSaxPrivileges }      from './saxParsers/parseSaxPrivileges'


const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  trimValues: true,
})


// Temp parser to not throw error, to be fully implemented
export async function parseSaveAsXML(xmlText, onProgress) { 
    onProgress?.(15, 'Reading XML...')


    let doc
    try {
        doc = xmlParser.parse(xmlText)
    } catch (err) {
        throw new Error('Invalid XML — is this a FileMaker Save-As-XML file?')
    }

    const root = doc.FMSaveAsXML || {}
    const file = toArray(root.File)[0] || {}

    const fileName  = root['@_Source'] || file['@_name'] || 'Unknown'
    const fmVersion = root['@_product'] || 'Unknown'

    onProgress?.(30, 'Parsing tables and fields...')
    const { tables, fields } = parseSaxBaseTables(file)

    onProgress?.(50, 'Parsing scripts...')
    const scripts = parseSaxScripts(file)

    onProgress?.(60, 'Parsing layouts...')
    const layouts = parseSaxLayouts(file, fields)

    onProgress?.(70, 'Parsing relationships...')
    const { occurrences, relationships } = parseSaxRelationships(file)

    onProgress?.(80, 'Parsing value lists and functions...')
    const valueLists      = parseSaxValueLists(file)
    const customFunctions = parseSaxCustomFunctions(file)
    const privilegeSets   = parseSaxPrivileges(file)
 
    onProgress?.(90, 'Linking table occurrences...')
 
    // Attach occurrences back to their base tables
    const tableByName = {}
    Object.values(tables).forEach(t => { tableByName[t.name] = t })
    Object.values(occurrences).forEach(occ => {
        tableByName[occ.baseTable]?.occurrences.push(occ.id)
    })


    return {
        meta: {
            format: 'saveAsXml',
            fmVersion,
            fileName,
            generatedAt: new Date().toISOString(),
        },
        tables, fields, scripts, layouts,
        occurrences, relationships,
        valueLists, customFunctions, privilegeSets,
        issues: [],
    }
}