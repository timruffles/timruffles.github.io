import fs from 'fs'

const HEADER_BYTES = 64 * 1024

export type Size = { width: number, height: number }

/**
 * Reads intrinsic pixel dimensions from an image file's header (PNG, JPEG, GIF, WebP).
 * Returns undefined for unsupported formats (e.g. SVG) or unreadable files.
 */
export function imageSize(file: string): Size | undefined {
  // headers live at the start of the file: read a prefix, not the whole image
  let buf: Buffer
  let fd: number | undefined
  try {
    fd = fs.openSync(file, 'r')
    buf = Buffer.alloc(HEADER_BYTES)
    buf = buf.slice(0, fs.readSync(fd, buf, 0, HEADER_BYTES, 0))
  } catch(e) {
    return undefined
  } finally {
    if(fd !== undefined) fs.closeSync(fd)
  }
  return parse(buf)
}

export function parse(b: Buffer): Size | undefined {
  // PNG: signature, then IHDR with width/height at 16/20
  if(b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return {width: b.readUInt32BE(16), height: b.readUInt32BE(20)}
  }
  // GIF
  if(b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return {width: b.readUInt16LE(6), height: b.readUInt16LE(8)}
  }
  // JPEG: walk segments to a start-of-frame marker
  if(b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while(i + 9 < b.length) {
      if(b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      if(marker === 0xff) { i++; continue }
      if(marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7)}
      }
      i += 2 + b.readUInt16BE(i + 2)
    }
    return undefined
  }
  // WebP
  if(b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16)
    if(kind === 'VP8 ') return {width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff}
    if(kind === 'VP8L') {
      const v = b.readUInt32LE(21)
      return {width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1}
    }
    if(kind === 'VP8X') return {width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1}
  }
  return undefined
}
