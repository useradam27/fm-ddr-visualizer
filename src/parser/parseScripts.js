/**
 * Parses all scripts and their steps from the DDR XML document.
 * Returns a scripts map keyed by script ID.
 */
export function parseScripts(doc) {
    const scripts = {}
  
    const scriptCatalog = doc.querySelector('ScriptCatalog')
    if (!scriptCatalog) return scripts
  
    // Helper to parse a single script element
    function parseScript(scriptEl, folder = '') {
      const id = scriptEl.getAttribute('id')
      const name = scriptEl.getAttribute('name')
      const steps = []
  
      scriptEl.querySelectorAll(':scope > StepList > Step').forEach(stepEl => {
        steps.push({
          id: stepEl.getAttribute('id'),
          name: stepEl.getAttribute('name'),
          enabled: stepEl.getAttribute('enable') !== 'False',
          // Capture raw XML of step parameters for display
          parameters: stepEl.innerHTML.trim(),
        })
      })
  
      scripts[id] = {
        id,
        name,
        folder,
        steps,

        callsScripts: [],
        calledByScripts: [],
      }
    }
  
    // Handle flat scripts and folder groups
    scriptCatalog.querySelectorAll(':scope > Script').forEach(el => {
      parseScript(el)
    })
  
    scriptCatalog.querySelectorAll('Group').forEach(groupEl => {
      const folderName = groupEl.getAttribute('name') || ''
      groupEl.querySelectorAll('Script').forEach(el => {
        parseScript(el, folderName)
      })
    })
  
    return scripts
  }