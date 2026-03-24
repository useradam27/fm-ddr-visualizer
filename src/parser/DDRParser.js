export function parseDDR(xmlText) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'application/xml')
  
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      throw new Error('Invalid XML — is this a FileMaker DDR file?')
    }
  
    // Detect FM version from the root element
    const root = doc.documentElement
    const fmVersion = root.getAttribute('xmlns') || 'Unknown'
  
    // Get the file name from the DDR
    const fileRef = root.querySelector('File')
    const fileName = fileRef?.getAttribute('name') || 'Unknown'
  
    return {
      meta: {
        fmVersion,
        fileName,
        generatedAt: new Date().toISOString(),
      },
      tables: {},
      fields: {},
      scripts: {},
      layouts: {},
      relationships: [],
      valueLists: {},
      customFunctions: {},
      privilegeSets: {},
      issues: [],
    }
  }