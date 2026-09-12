import { toArray } from '../utils'
 
//intentional duplicate from drr version for now, looking into save as xml file and the paths are nearly the same.
//keeping as separate file in case I want to edit further with differences, but this is hust to get things going
export function parseSaxValueLists(root) {
    const valueLists = {}

    const catalog = root.ValueListCatalog
    if (!catalog) return valueLists
    

    toArray(catalog.ValueList).forEach(el => {
        const id = el['@_id']

        const values = toArray(el.Value).map(v => typeof v === 'string' ? v: (v['#text'] || '')).filter(Boolean)

        const sourceField = el.Field


        valueLists[id] = {
            id,
            name: el['@_name'],
            type: el['@_type'] || 'Custom',
            values,
            sourceTable: sourceField?.['@_table'] || '',
            sourceField: sourceField?.['@_field'] || ''
        }
    })
    return valueLists
}