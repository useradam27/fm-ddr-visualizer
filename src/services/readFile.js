export async function readFileAsText(file) {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer.slice(0, 4))

  // UTF-16 LE BOM
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return new TextDecoder('utf-16le').decode(buffer)
  }
  // UTF-16 BE BOM
  if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
    return new TextDecoder('utf-16be').decode(buffer)
  }
  // No BOM, but null bytes in odd positions means UTF-16 LE
  if (bytes[1] === 0x00 && bytes[3] === 0x00) {
    return new TextDecoder('utf-16le').decode(buffer)
  }

  return new TextDecoder('utf-8').decode(buffer)
}