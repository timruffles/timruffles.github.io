import {promisify} from 'util'
import yaml from 'yaml'
import fs from 'fs'
import {glob} from "glob";
import {exec} from "child_process";
import {Article} from "./records";
import {homePage, layout} from "./templates";

main();

async function main() {
  const pageFolders = ["articles", "blogs", "pages"];

  const outputPath = "./gh-pages/"

  const loaded = (await Promise.all(pageFolders.map(loadPagesFromDirectory))).flatMap(x => x)
  const errors = loaded.filter(e => e instanceof Error)
  if(errors.length) {
    console.error("Articles with errors", errors)
  }
  const pages = loaded.filter(isArticle)
    .filter(a => !a.draft)

  exec(`cp -R public/* gh-pages`)

  pages.forEach(article => writeArticle(outputPath, article))

  const forHome = pages
    .filter(a => a.category !== 'pages')
    .sort((a,b) => +b.date - +a.date)
    .slice(0, 15)

  fs.writeFileSync(`${outputPath}/index.html`,  layout({
    title: "Tim Ruffles' blog",
    slug: "",
    content: homePage(forHome),
  }));
}

async function loadPagesFromDirectory(dir: string): Promise<(Article | Error)[]> {
  const files = await promisify(glob)(`${dir}/**/*.txt`)

  const results = await Promise.all(files.map(loadPage))

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

function writeArticle(outputPath: string, article: Article) {
  const html = layout({
    title: article.title,
    slug: article.slug,
    content: article.body,
  })
  writeHTMLPage(outputPath, article.slug, html);
}

async function loadPage(path: string): Promise<Article | Error> {
  const found = fs.readFileSync(path, {encoding: 'utf8'})
  try {
    return Article.fromObject(path, yaml.parse(found))
  } catch(e) {
    return e
  }
}

export function titleToSlug(title: string) {
  return title.replace(/ /g,'-').toLowerCase().replace(/[^a-z0-9-]/g,'').replace(/-+/,'-')
}

function isArticle(e: any): e is Article {return e instanceof Article}
