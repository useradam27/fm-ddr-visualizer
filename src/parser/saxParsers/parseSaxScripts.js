import { toArray } from '../utils'

export function parseSaxScripts(root) {
    const scripts = {}

    function stepText(stepEl) {
        const t = stepEl.Text
        if (typeof t === 'string') return t
        if (t?.['#text']) return t['#text']
        if (typeof stepEl['#text'] === 'string') return stepEl['#text']
        return stepEl['@_name'] || ''
    }

    // Pass 1 — walk the flat catalog, tracking folder nesting with a stack.
    // isFolder="True" opens a folder; isFolder="Marker" closes the latest one.
    const folderStack = []

    toArray(root.ScriptCatalog?.Script).forEach(el => {
    const flag = el['@_isFolder']

    if (flag === 'True') {
        folderStack.push(el['@_name'] || '')
        return
    }
    if (flag === 'Marker') {
        folderStack.pop()
        return
    }

    const id = el['@_id']
    scripts[id] = {
        id,
        name: el['@_name'],
        folder: folderStack.join(' / '),
        steps: [],
        source: '',
        callsScripts: [],
        calledByScripts: [],
    }
    })

    // Pass 2 — attach steps from StepsForScripts by script id
    toArray(root.StepsForScripts?.Script).forEach(entry => {
        const script = scripts[entry.ScriptReference?.['@_id']]
        if (!script) return

        const sourceLines = []
        toArray(entry.ObjectList?.Step).forEach(stepEl => {
        const enabled = stepEl['@_enable'] !== 'False'
        script.steps.push({
            id: stepEl['@_id'],
            name: stepEl['@_name'],
            enabled,
            parameters: stepEl,
        })
        sourceLines.push(`${enabled ? '' : '// '}${stepText(stepEl)}`)
        })
        script.source = sourceLines.join('\n')
    })

    return scripts
}