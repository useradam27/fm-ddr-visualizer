/**
 * Parses all base tables and their fields from the DDR XML document.
 * Returns { tables, fields } as normalized maps keyed by ID.
 */
export function parseFields(doc) {
    const tables = {}
    const fields = {}
  
    const baseTableCatalog = doc.querySelector('BaseTableCatalog')
    if (!baseTableCatalog) return { tables, fields }
  
    baseTableCatalog.querySelectorAll('BaseTable').forEach(tableEl => {
      const tableId = tableEl.getAttribute('id')
      const tableName = tableEl.getAttribute('name')
  
      const table = {
        id: tableId,
        name: tableName,
        fields: [],
        occurrences: [],
      }
  
      tableEl.querySelectorAll('Field').forEach(fieldEl => {
        const fieldId = `${tableId}_${fieldEl.getAttribute('id')}`
        const fieldName = fieldEl.getAttribute('name')
        const dataType = fieldEl.getAttribute('dataType') || 'Text'
        const fieldType = fieldEl.getAttribute('fieldType') || 'Normal'
  
        // Auto-enter options
        const autoEnterEl = fieldEl.querySelector('AutoEnter')
        const validationEl = fieldEl.querySelector('Validation')
        const storageEl = fieldEl.querySelector('Storage')
  
        const field = {
          id: fieldId,
          tableId,
          tableName,
          name: fieldName,
          dataType,
          fieldType,
          comment: fieldEl.getAttribute('comment') || '',
          options: {
            autoEnter: autoEnterEl?.getAttribute('value') !== 'No',
            global: storageEl?.getAttribute('global') === 'True',
            repeats: parseInt(storageEl?.getAttribute('maxRepetition') || '1'),
            unique: validationEl?.querySelector('Unique')?.getAttribute('value') === 'True',
            required: validationEl?.querySelector('NotEmpty')?.getAttribute('value') === 'True',
          },

          usedInScripts: [],
          usedInLayouts: [],
        }
  
        fields[fieldId] = field
        table.fields.push(fieldId)
      })
  
      tables[tableId] = table
    })
  
    return { tables, fields }
  }