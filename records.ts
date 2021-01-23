import {titleToSlug} from "./build";
import marked from 'marked'
import prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-shell-session'
import {attempt} from "./language";
import path from 'path'



export class Article {
  readonly slug: string;

  constructor(
    readonly filePath: string,
    readonly title: string,
    readonly date: Date,
    readonly draft: boolean,
    readonly slugs: string[],
    readonly bodyHTML: string,
    readonly description: string,
    readonly category: string,
  ) {
    this.slug = slugs[0] || titleToSlug(title)
  }

  static fromObject(p: string, raw: { [k: string]: any }): Article | Error {
    const {
      title = '',
      date = '',
      draft = false,
      slug = '',
      body = '',
      previousSlugs = [],
    } = raw;

    const category = path.basename(path.dirname(p))

    const missing = ['title', 'date', 'body'].filter(k => !raw[k])
    if (missing.length) {
      return Error(`missing required fields: ${missing.join(' ')}`)
    }

    const html = attempt(() => marked(body, {
      highlight: (code, lang) => {
        return prism.highlight(code, prism.languages[lang] || prism.languages.clike, lang)
      }
    }))
    if(html instanceof Error) {
      return html
    }

    const description = truncate((body.match(/^.*\n/) || [])[0] || '', 256, '…');


    const dateParsed = Date.parse(date);
    if (isNaN(dateParsed)) {
      return Error(`invalid date ${date}`)
    }

    const slugs = [slug, ...previousSlugs];

    return new Article(p, title, new Date(dateParsed), draft, slugs, html, description, category)
  }
}

function truncate(s: string, max: number, replace: string): string {
  if(s.length <= max) {
    return s
  }
  return s.slice(0, max) + replace;
}
