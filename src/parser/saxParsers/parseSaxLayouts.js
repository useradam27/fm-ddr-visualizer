import { toArray } from '../utils'

//intentional duplicate from drr version for now, looking into save as xml file and the paths are nearly the same.
//keeping as separate file in case I want to edit further with differences, but this is hust to get things going
export function parseSaxLayouts(root, fields) {
    const layouts = {}

    const fieldByKey = {}
    Object.values(fields).forEach(f => {
        fieldByKey[`${f.tableName}::${f.name}`] = f
    })

    const catalog = root.LayoutCatalog
    if (!catalog) return { layouts }

    function readLayout(layoutEl) {
        const id = layoutEl['@_id']
        const layoutFields = toArray(layoutEl.Field)

        layoutFields.forEach(fieldEl => {
            const tableName = fieldEl['@_table']
            const fieldName = fieldEl['@_field']
            const match = fieldByKey[`${tableName}::${fieldName}`]
            if (match && !match.usedInLayouts.includes(id)) {
                match.usedInLayouts.push(id)
            }
        })

        layouts[id] = {
            id,
            name: layoutEl['@_name'],
            baseTable: layoutEl['@_TableOccurrence'] || '',
            fieldCount: layoutFields.length,
        }
    }

    toArray(catalog.Layout).forEach(readLayout)

    //get layouts inside folders
    function readGroup(groupEl) {
        toArray(groupEl.Layout).forEach(readLayout)
        toArray(groupEl.Group).forEach(readGroup)
    }

    toArray(catalog.Group).forEach(readGroup)

    return layouts
}