import { toArray } from '../utils'

export function parseScripts(root) {
    const scripts = {}

    const catalog = root.ScriptCatalog
    if (!catalog) return { scripts }

    function readScript(scriptEl, folder = '') {
        const id = scriptEl['@_id']
        const steps = []
 
        toArray(scriptEl.StepList?.Step).forEach(stepEl => {
            steps.push({
                id:      stepEl['@_id'],
                name:    stepEl['@_name'],
                enabled: stepEl['@_enable'] !== 'False',
                parameters: stepEl,
            })
        })
 
        scripts[id] = {
            id,
            name: scriptEl['@_name'],
            folder,
            steps,
            callsScripts: [],
            calledByScripts: [],
        }
    }
 
    // Top-level scripts (not in a folder)
    toArray(catalog.Script).forEach(el => readScript(el))
 
    // Scripts inside folders
    function readGroup(groupEl, parentPath = '') {
        const folderName = groupEl['@_name'] || ''
        const path = parentPath ? `${parentPath} / ${folderName}` : folderName
    
        toArray(groupEl.Script).forEach(el => readScript(el, path))
        toArray(groupEl.Group).forEach(sub => readGroup(sub, path))
    }
 
    toArray(catalog.Group).forEach(el => readGroup(el))
 
    return scripts
}
