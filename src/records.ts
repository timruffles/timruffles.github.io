import {Config, titleToSlug} from "./build-system";
import marked from 'marked'
import prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-shell-session'
import path from 'path'
import crypto from "crypto";
import {attempt} from "./language";
import {imageSize} from "./image-size";
import {BRIGHT_THRESHOLD, brightnessOf, warnBright} from "./image-brightness";
const jsdom = require("jsdom");
const { JSDOM } = jsdom


class ArticleError extends Error {
  constructor(mesage: string, readonly path: string) {
    super()
  }
}



export class Article {

  readonly commentId: string

  constructor(
    readonly filePath: string,
    readonly title: string,
    readonly date: Date,
    readonly status: 'active' | 'archived' | 'draft',
    // includes leading slash
    readonly slug: string,
    readonly bodyHTML: string,
    readonly description: string,
    readonly category: string,
    commentIdRaw = slug,
    // shown in the 'Selected' section of the front page (front matter: selected: true)
    readonly selected = false,
  ) {
    // id is used for the comment system. It's currently using the slug. May want to add
    // ability
    this.commentId =  crypto.createHash('md5').update(commentIdRaw).digest().toString('base64url' as any);
  }

  static fromObject(p: string, raw: { [k: string]: any }, cfg: Config): Article | Error {
    const {
      title = '',
      date = '',
      draft = false,
      slug: rawSlug = '',
      body = '',
      archived = false,
      // set commentId to provide stability if slug changes after publication
      commentId = undefined,
      previousSlugs = [],
      selected = false,
    } = raw;

    const currentSlug = rawSlug || titleToSlug(title);

    const categoryFromPath = p.split('/')[0] || 'missing';

    const missing = ['title', 'date', 'body'].filter(k => !raw[k])
    if (missing.length) {
      return Error(`${p}: missing required fields: ${missing.join(' ')}`)
    }

    // rewrite all links
    function htmlRenderer(fragment: string) {
      // only parse when there's something to rewrite: JSDOM would auto-close a lone
      // opening tag like <details>, breaking html wrapped around markdown blocks
      if(!/<(img|a)[\s>]/i.test(fragment)) return fragment
      const dom = new JSDOM(`<!DOCTYPE html>${fragment}`).window.document;
      for(const el of dom.querySelectorAll('img')) {
        el.src = prepareHref(el.src)
      }
      for(const el of dom.querySelectorAll('a')) {
        el.href = prepareHref(el.href.replace(/about:blank/, ''))
      }
      return dom.body.innerHTML
    }

    function link(href: string, title: string, text: string) {
      // add sup to footnote only links
      if(/^\s*\d+\s*$/.test(text)) {
        text = `<sup>${text}</sup>`
      }
      return `<a href="${prepareHref(href)}" ${title ? `title="${title}" ` : ''}>${text}</a>`
    }

    function prepareHref(href: string) {
      return /^(http|www|#)/.test(href) ? href : `${cfg.baseURL}${trimSlashPrefix(href)}`;
    }

    // image path as written in markdown -> file under public/
    function localFile(href: string) {
      return path.join(__dirname, '..', 'public', decodeURIComponent(trimSlashPrefix(href)))
    }

    // ![${text}](href#modifier modifier) - modifiers are URL-fragment tokens, e.g.
    //   ![alt](img/a.png#small)         images: small | medium | (default: full column width)
    //   ![alt](img/a.mp4)               video: .mp4/.webm/.mov render a <video controls>
    //   ![alt](img/a.mp4#loop)          video: loop = muted autoplay loop, no controls (gif-like)
    // any token becomes a class "m-<token>" styled in views/css/style.css
    function image(srcURL: string, title: string, text: string) {
      const [path, fragment = ''] = srcURL.split('#')
      const mods = fragment.split(/[,+]/).filter(m => /^[a-z0-9-]+$/.test(m))
      const local = !/^(https?:)?\/\//.test(path)
      const file = local ? localFile(path) : ''
      const luminance = local ? brightnessOf(file) : undefined
      const bright = luminance !== undefined && luminance >= BRIGHT_THRESHOLD
      if(bright) warnBright(file, luminance!, p)
      const classes = ['media', ...mods.map(m => `m-${m}`), ...(bright ? ['m-bright'] : [])].join(' ')
      const src = prepareHref(path)
      if(/\.(mp4|webm|mov)$/i.test(path)) {
        const attrs = mods.includes('loop') ? 'autoplay loop muted playsinline' : 'controls preload="metadata"'
        const label = text || title
        return `<video class="${classes}" src="${src}" ${attrs}${label ? ` aria-label="${label}"` : ''}></video>`
      }
      // intrinsic size lets the browser reserve space before load (no layout shift)
      const size = local ? imageSize(file) : undefined
      const dims = size ? ` width="${size.width}" height="${size.height}"` : ''
      return `<img class="${classes}" src="${src}"${dims} alt="${text || title || ''}" />`
    }

    marked.use({
      renderer: {
        link,
        html: htmlRenderer,
        image,
      },
    } as any /* typings wrong, merged in  */)

    const html = attempt(() => marked(body, {
      highlight: (code, lang) => {
        if(lang === 'gitlog') return renderGitLog(code)
        // no language, or ```text / ```plain / ```none => no highlighting, just escaped
        const grammar = lang && prism.languages[lang]
        if(!grammar) {
          return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }
        return prism.highlight(code, grammar, lang)
      }
    }))
    if(html instanceof Error) {
      return Error(`${p}: ${html.message}`)
    }

    // first non-empty line of the body (block scalars often open with a blank line)
    const description = truncate((body.replace(/^\s+/, '').match(/^.*(\n|$)/) || [''])[0].trim(), 256, '…');


    const dateParsed = Date.parse(date);
    if (isNaN(dateParsed)) {
      return Error(`${p}: invalid date ${date}`)
    }

    const slugBased = `${cfg.baseURL}${currentSlug}`

    const status = archived ? 'archived' : draft ? 'draft' : 'active';

    return new Article(p, title, new Date(dateParsed), status, slugBased, html, description, categoryFromPath,
      commentId || currentSlug, selected === true)
  }
}

function truncate(s: string, max: number, replace: string): string {
  if(s.length <= max) {
    return s
  }
  return s.slice(0, max) + replace;
}

function trimSlashPrefix(href: string) {
  return href.replace(/^[/]/, '')
}


const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/**
 * ```gitlog fence: lines of `<iso timestamp> <hash> <message>` (git log --format='%aI %h %s').
 * Hashes are dropped and timestamps shortened and lightened. Other lines (e.g. `...`) pass through.
 */
function renderGitLog(code: string): string {
  return code.replace(/\n+$/, '').split('\n').map(line => {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})\S*\s+[0-9a-f]{6,40}\s+(.*)$/.exec(line)
    if(!m) return `<span class="gl-gap">${esc(line)}</span>`
    const [, , mo, day, hh, mm, message] = m
    return `<span class="gl-date">${MONTHS[+mo - 1]} ${+day} ${hh}:${mm}</span> ${esc(message)}`
  }).join('\n')
}
