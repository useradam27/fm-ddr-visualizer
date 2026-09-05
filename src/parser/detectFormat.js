//detect format (save as xml or ddr) by checking the root element

export function detectFormat(xmlText) {
    const head = xmlText.slice(0,2048);

    if (head.includes('<FM_SAVE_AS_XML')) return 'saveAsXml'
    if (head.includes('<FMDynamicTemplate')) return 'drr'
    if (head.includes('<FMPReport')) return 'drr'

    return 'unknown'
}