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
    } = raw;

    const currentSlug = rawSlug || titleToSlug(title);

    const categoryFromPath = p.split('/')[0] || 'missing';

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

    const slugs = [currentSlug, ...previousSlugs];
    const slugBased = `${cfg.baseURL}${currentSlug}`

    const status = archived ? 'archived' : draft ? 'draft' : 'active';

    return new Article(p, title, new Date(dateParsed), status, slugBased, html, description, categoryFromPath,
      commentId || currentSlug)
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
