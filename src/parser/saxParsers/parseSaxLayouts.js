import { toArray } from '../utils'


export function parseSaxLayouts(root, fields, occurrences) {
    const layouts = {}

    const fieldByKey = {}
    Object.values(fields).forEach(f => {
        fieldByKey[`${f.tableName}::${f.name}`] = f
    })

    // FieldReferences name an occurrence; map it back to the base table
    const baseTableByOcc = {}
    Object.values(occurrences).forEach(o => { baseTableByOcc[o.name] = o.baseTable })

    // Collect FieldReference nodes anywhere in the layout — covers fields
    // inside groups, portals, tab panels, and calculations
    function collectFieldRefs(node, out, depth = 0) {
        if (!node || typeof node !== 'object' || depth > 40) return
        if (Array.isArray(node)) {
            node.forEach(n => collectFieldRefs(n, out, depth + 1))
            return
        }
        for (const [key, value] of Object.entries(node)) {
            if (key === 'FieldReference') {
                toArray(value).forEach(ref => {
                    const occName = ref?.TableOccurrenceReference?.['@_name']
                    out.push({ table: baseTableByOcc[occName] || occName, name: ref?.['@_name'] })
                })
            } else if (value && typeof value === 'object') {
                collectFieldRefs(value, out, depth + 1)
            }
        }
    }

    // Flat catalog: isFolder="True" opens a folder, "Marker" closes it
    const folderStack = []

    toArray(root.LayoutCatalog?.Layout).forEach(layoutEl => {
        const flag = layoutEl['@_isFolder']
        if (flag === 'True')   { folderStack.push(layoutEl['@_name'] || ''); return }
        if (flag === 'Marker') { folderStack.pop(); return }

        const id = layoutEl['@_id']
        
        const refs = []
        collectFieldRefs(layoutEl.PartsList, refs)

        const distinct = new Set()
        refs.forEach(r => {
            const field = fieldByKey[`${r.table}::${r.name}`]
            if (!field) return
            distinct.add(field.id)
            if (!field.usedInLayouts.includes(id)) field.usedInLayouts.push(id)
        })

        layouts[id] = {
            id,
            name:       layoutEl['@_name'],
            folder:     folderStack.join(' / '),
            baseTable:  layoutEl.TableOccurrenceReference?.['@_name'] || '',
            fieldCount: distinct.size,
        }
    })

    return layouts
}
