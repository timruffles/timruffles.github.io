import {Config, titleToSlug} from "./build";
import marked from 'marked'
import prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-shell-session'
import {attempt} from "./language";
import path from 'path'
const jsdom = require("jsdom");
const { JSDOM } = jsdom


class ArticleError extends Error {
  constructor(mesage: string, readonly path: string) {
    super()
  }
}



export class Article {
  constructor(
    readonly filePath: string,
    readonly title: string,
    readonly date: Date,
    readonly status: 'active' | 'archived' | 'draft',
    readonly slug: string,
    readonly bodyHTML: string,
    readonly description: string,
    readonly category: string,
  ) {
  }

  static fromObject(p: string, raw: { [k: string]: any }, cfg: Config): Article | Error {
    const {
      title = '',
      date = '',
      draft = false,
      slug = '',
      body = '',
      archived = false,
      previousSlugs = [],
    } = raw;

    const category = p.split('/')[0] || 'missing';

    const missing = ['title', 'date', 'body'].filter(k => !raw[k])
    if (missing.length) {
      return Error(`${p}: missing required fields: ${missing.join(' ')}`)
    }

    // rewrite all links
    function htmlRenderer(fragment: string) {
      const dom = new JSDOM(`<!DOCTYPE html>${fragment}`).window.document;
      for(const el of dom.querySelectorAll('img')) {
        el.src = prepareHref(el.src)
      }
      for(const el of dom.querySelectorAll('a')) {
        el.href = prepareHref(el.href)
      }
      return dom.body.innerHTML
    }

    function link(href: string, title: string, text: string) {
      return `<a href="${prepareHref(href)}" ${title ? `title="${title} ` : ''}>${text}</a>`
    }

    function prepareHref(href: string) {
      return /^(http|www)/.test(href) ? href : `${cfg.baseURL}${trimSlashPrefix(href)}`;
    }

    // ![${text}](href)
    function image(srcURL: string, title: string, text: string) {
      return `<img src="${prepareHref(srcURL)}" alt="${text || title || ''}" />`
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
        return prism.highlight(code, prism.languages[lang] || prism.languages.clike, lang)
      }
    }))
    if(html instanceof Error) {
      return Error(`${p}: ${html.message}`)
    }

    const description = truncate((body.match(/^.*\n/) || [])[0] || '', 256, '…');


    const dateParsed = Date.parse(date);
    if (isNaN(dateParsed)) {
      return Error(`${p}: invalid date ${date}`)
    }

    const slugs = [slug, ...previousSlugs];
    const slugBased = `${cfg.baseURL}${slugs[0] || titleToSlug(title)}`

    const status = archived ? 'archived' : draft ? 'draft' : 'active';

    return new Article(p, title, new Date(dateParsed), status, slugBased, html, description, category)
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
