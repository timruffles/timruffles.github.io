import fs from 'fs'
import path from 'path'
import {glob} from 'glob'
import {promisify} from 'util'

/**
 * Build-time check for images that will glare in dark mode.
 *
 * analyseImages() scans public/img once (async, sharp) and caches mean luminance per file
 * (keyed by mtime+size, in .image-brightness-cache.json) so rebuilds only analyse new or
 * changed files. The markdown image renderer then looks results up synchronously via
 * brightnessOf(): images at or above BRIGHT_THRESHOLD get class "m-bright", which dark.css
 * dims, and a warning is printed so you notice.
 *
 * Transparent images are flattened onto the dark page background first, so a transparent
 * diagram isn't flagged just because its hidden pixels are white.
 */

// mean luminance 0 (black) .. 1 (white). The 1995 manual page is ~0.63; a white-background diagram ~0.9
export const BRIGHT_THRESHOLD = 0.6
const DARK_BG = '#14161a'
const EXTENSIONS = 'png,jpg,jpeg,gif,webp'
const CACHE_FILE = path.join(__dirname, '..', '.image-brightness-cache.json')

type Entry = { key: string, luminance: number }
const results = new Map<string, number>()

export async function analyseImages(publicPath: string): Promise<void> {
  let sharp: any
  try {
    sharp = require('sharp')
  } catch(e) {
    console.warn('image brightness check skipped: sharp not installed')
    return
  }

  let cache: {[file: string]: Entry} = {}
  try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) } catch(e) { /* first run */ }

  const files = await promisify(glob)(`${publicPath}/img/**/*.{${EXTENSIONS}}`, {nocase: true})
  const next: {[file: string]: Entry} = {}
  await Promise.all(files.map(async file => {
    const rel = path.relative(publicPath, file)
    const st = fs.statSync(file)
    const key = `${st.mtimeMs}:${st.size}`
    if(cache[rel] && cache[rel].key === key) {
      next[rel] = cache[rel]
    } else {
      try {
        const {channels} = await sharp(file)
          .resize(64, 64, {fit: 'inside'})
          .flatten({background: DARK_BG})
          .stats()
        const [r, g, b] = channels.map((c: {mean: number}) => c.mean)
        next[rel] = {key, luminance: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255}
      } catch(e) {
        return // unreadable/unsupported image: leave it unflagged
      }
    }
    results.set(path.resolve(file), next[rel].luminance)
  }))

  try { fs.writeFileSync(CACHE_FILE, JSON.stringify(next)) } catch(e) { /* cache is best-effort */ }
}

/** mean luminance 0..1 for an analysed local image, or undefined */
export function brightnessOf(file: string): number | undefined {
  return results.get(path.resolve(file))
}

const warned = new Set<string>()
export function warnBright(file: string, luminance: number, article: string) {
  const k = `${file}`
  if(warned.has(k)) return
  warned.add(k)
  console.warn(`bright image (luminance ${luminance.toFixed(2)}): ${path.relative(process.cwd(), file)} in ${article} - dimmed in dark mode`)
}
