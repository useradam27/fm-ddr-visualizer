import {toArray} from '../utils'

export function parseSaxBaseTables(root) {
    const tables = {}
    const fields = {}

    //first pass to get tables
    toArray(root.BaseTableCatalog?.BaseTable).forEach(tableEl => {
        const tableId = tableEl['@_id']
        tables[tableId] = {
            id: tableId,
            name: tableEl['@_name'],
            fields: [],
            occurrences: [],
        }
    })

    toArray(root.FieldsForTables?.FieldCatalog).forEach(catalogEl => {
        const tableId = catalogEl.BaseTableReference['@_id']
        const table = tables[tableId]
        if(!table) return

        toArray(catalogEl.ObjectList?.Field).forEach(fieldEl => {
            const fieldId = `${tableId}_${fieldEl['@_id']}`
            const storage = fieldEl.Storage
            const validation = fieldEl.Validation

            fields[fieldId] = {
                id: fieldId,
                tableId,
                tableName: table.name,
                name: fieldEl['@_name'],
                dataType: fieldEl['@_datatype'] || 'Text',
                fieldType: fieldEl['@_fieldtype'] || 'Normal',
                comment: fieldEl['@_comment'] || '',
                options: {
                    autoEnter: fieldEl.AutoEnter?.['@_value'] !== 'No',
                    global: storage?.['@_global'] === 'True',
                    repeats: parseInt(storage?.['@_maxRepetitions'] || '1', 10),
                    unique:    validation?.['@_unique']   === 'True',
                    required:  validation?.['@_notEmpty'] === 'True',
                },
                usedInScripts: [],
                usedInLayouts: [],
            }

            table.fields.push(fieldId)
        })
    })

    return { tables, fields }
}