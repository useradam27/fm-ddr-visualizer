import {toArray} from '../utils'

export function parseSaxBaseTables(root) {
    const tables = {}
    const fields = {}

    const catalog = root.BaseTableCatalog
    if (!catalog) return { tables, fields }

    toArray(catalog.BaseTable).forEach(tableEl => {
        const tableId = tableEl['@_id']
        const tableName = tableEl['@_name']

        const table = { id: tableId, name: tableName, fields: [], occurrences: [] }

        toArray(tableEl.FieldCatalog?.Field).forEach(fieldEl => {
            const fieldId = `${tableId}_${fieldEl['@_id']}`
            const storage = fieldEl.Storage

            fields[fieldId] = {
                id: fieldId,
                tableId,
                tableName,
                name: fieldEl['@_name'],
                dataType: fieldEl['@_dataType'] || 'Text',
                fieldType: fieldEl['@_fieldType'] || 'Normal',
                comment: fieldEl['@_comment'] || '',
                options: {
                    autoEnter: fieldEl.AutoEnter?.['@_value'] !== 'No',
                    global: storage?.['@_global'] === 'True',
                    repeats: parseInt(storage?.['@_maxRepitions'] || '1', 10),
                    unique: fieldEl.Validation?.Unique?.['@_value'] === 'True',
                    required: fieldEl.Validation?.NotEmpty?.['@_value'] === 'True',
                },
                usedInScripts: [],
                usedInLayouts: [],
            }

            table.fields.push(fieldId)
        })
        
        tables[tableId] = table
    })

    return { tables, fields }
}