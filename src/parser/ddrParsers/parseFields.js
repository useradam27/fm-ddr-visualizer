import { toArray } from '../utils'

export function parseFields(root) {
    const tables = {}
    const fields = {}

    const catalog = root.BaseTableCatalog
    if (!catalog) return { tables, fields }

    toArray(catalog.BaseTable).forEach(tableEl => {
        const tableID = tableEl['@_id']
        const tableName = tableEl['@_name']

        const table = {
            id: tableID,
            name: tableName,
            fields: [],
            occurrences: []
        }

        toArray(tableEl.FieldCatalog?.Field).forEach(fieldEl => {
            const fieldID = `${tableID}_${fieldEl['@_id']}`

            const storage = fieldEl.Storage
            const validation = fieldEl.Validation
            const autoEnter = fieldEl.AutoEnter

            fields[fieldID] = {
                id: fieldID,
                tableID,
                tableName,
                name: fieldEl['@_name'],
                dataType: fieldEl['@_dataType'] || 'Text',  //pretty sure FM defaults to Text
                fieldType: fieldEl['@_fieldType'] || 'Normal',
                comment: fieldEl['@_comment'] || '',
                options: {
                    autoEnter: autoEnter?.['@_value'] !== 'No',
                    global:    storage?.['@_global'] === 'True',
                    repeats:   parseInt(storage?.['@_maxRepetition'] || '1', 10),
                    unique:    validation?.Unique?.['@_value']   === 'True',
                    required:  validation?.NotEmpty?.['@_value'] === 'True',
                },
                usedInScripts: [],
                usedInLayouts: [],
            }
            table.fields.push(fieldID)
        })
        tables[tableID] = table
    })
    return { tables, fields }
}
