import { toArray } from '../utils'


export function parseSaxScripts(root) {
    const scripts = {}

    const catalog = root.ScriptCatalog
    if (!catalog) return scripts

    function stepText(stepEl) {
        const t = stepEl.Text
        if (typeof t === 'string') return t
        if (t?.['#text']) return t['#text']
        if (typeof stepEl['#text'] === 'string') return stepEl['#text']
        return stepEl['@_name'] || ''
    }

    function readScript(scriptEl, folder = '') {
        const id = scriptEl['@_id']
        const steps = []
        const sourceLines = []

        toArray(scriptEl.StepList?.Step).forEach(stepEl => {
            const name = stepEl['@_name']
            const enabled = stepEl['@_enable'] !== 'False'

            steps.push({
                id: stepEl['@_id'],
                name,
                enabled,
                parameters: stepEl,
            })

            sourceLines.push(`${enabled ? '' : '// '}${stepText(stepEl)}`)
        })

        scripts[id] = {
            id,
            name: scriptEl['@_name'],
            folder,
            steps,
            source: sourceLines.join('\n'),
            callsScrips: [],
            calledByScripts: [],
        }
    }

    toArray(catalog.Script).forEach(el => readScript(el))

    function readGroup(groupEl, parentPath = '') {
        const folderName = groupEl['@_name'] || ''
        const path = parentPath ? `${parentPath}/${folderName}` : folderName
        toArray(groupEl.Script).forEach(el => readScript(el, path))
        toArray(groupEl.Group).forEach(sub => readGroup(sub, path))
    }
    toArray(catalog.Group).forEach(el => readGroup(el))

    return scripts

}