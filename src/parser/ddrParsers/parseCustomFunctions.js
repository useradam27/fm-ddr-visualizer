import { toArray } from '../utils'
 
export function parseCustomFunctions(root) {
    const customFunctions = {}
 
    const catalog = root.CustomFunctionCatalog
    if (!catalog) return customFunctions
 
    toArray(catalog.CustomFunction).forEach(el => {
        const id = el['@_id']
 
        const calc = el.Calculation
        const formula = typeof calc === 'string' ? calc : (calc?.['#text'] || el['#text'] || '')
 
        customFunctions[id] = {
            id,
            name:       el['@_name'],
            parameters: el['@_parameters'] || '',
            formula:    formula.trim(),
        }
    })
 
    return customFunctions
}
