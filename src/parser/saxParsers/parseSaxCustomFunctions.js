import { toArray } from '../utils'
 

//intentional duplicate from drr version for now, looking into save as xml file and the paths are nearly the same.
//keeping as separate file in case I want to edit further with differences, but this is hust to get things going
export function parseSaxCustomFunctions(root) {
    const customFunctions = {}
 
    const catalog = root.CustomFunctionsCatalog?.ObjectList
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