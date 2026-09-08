//detect format (save as xml or ddr) by checking the root element

export function detectFormat(xmlText) {
    const head = xmlText.slice(0,2048);

    if (head.includes('<FMSaveAsXML')) return 'saveAsXml'
    if (head.includes('<FMPReport')) return 'drr'

    return 'unknown'
}