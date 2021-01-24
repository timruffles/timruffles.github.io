import {promisify} from 'util'
import yaml from 'yaml'
import fs from 'fs'
import {glob} from "glob";
import {exec} from "child_process";
import {Article} from "./records";
import {homePage, layout, page, rss} from "./templates";

export class Config {
  constructor(readonly baseURL: string) {
  }
}

main();


async function main() {
  const baseURL = process.env.BASE_URL || "/";

  const pageFolders = ["articles", "blogs", "pages"];

  const config = new Config(baseURL)

  const outputPath = "./gh-pages/"

  const loaded = (await Promise.all(pageFolders.map(p => loadPagesFromDirectory(p, config)))).flatMap(x => x)
  const errors = loaded.filter((e: Article | Error): e is Error => e instanceof Error)
  if(errors.length) {
    console.error("Articles with errors", errors.map(a => a.message))
  }
  const pages = loaded.filter(isArticle)
    .filter(a => a.status === 'active')

  exec(`cp -R public/* gh-pages`)

  pages.forEach(article => writeArticle(outputPath, article, config))

  const articlesDesc = pages
    .filter(a => a.category !== 'pages')
    .sort((a,b) => +b.date - +a.date)

  fs.writeFileSync(`${outputPath}/index.html`,  layout({
    title: "Tim Ruffles' blog",
    slug: "",
    baseURL: baseURL,
    content: homePage(articlesDesc.slice(0, 15)),
  }));

  fs.writeFileSync(`${outputPath}/rss.xml`,  rss(articlesDesc));
}

async function loadPagesFromDirectory(dir: string, config: Config): Promise<(Article | Error)[]> {
  const files = await promisify(glob)(`${dir}/**/*.txt`)

  const results = await Promise.all(files.map(p => loadPage(p, config)))

  return results
}

function writeHTMLPage(outputPath: string, slug: string, html: string) {
  const dir = `${outputPath}/${slug}`
  try {
    fs.mkdirSync(dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  fs.writeFileSync(`${dir}/index.html`, html)
}

function writeArticle(outputPath: string, article: Article, cfg: Config) {
  const html = layout({
    title: article.title,
    slug: article.slug,
    baseURL: cfg.baseURL,
    content: page(article, cfg)
  })
  writeHTMLPage(outputPath, article.slug, html);
}

async function loadPage(path: string, cfg: Config): Promise<Article | Error> {
  const found = fs.readFileSync(path, {encoding: 'utf8'})
  try {
    return Article.fromObject(path, yaml.parse(found), cfg)
  } catch(e) {
    return e
  }
}

export function titleToSlug(title: string) {
  return title.replace(/ /g,'-').toLowerCase().replace(/[^a-z0-9-]/g,'').replace(/-+/,'-')
}

function isArticle(e: any): e is Article {return e instanceof Article}
