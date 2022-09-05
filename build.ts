import {promisify} from 'util'
import yaml from 'yaml'
import fs from 'fs'
import {glob} from "glob";
import {exec} from "child_process";
import {Article} from "./records";
import {ArticleForRendering, homePage, layout, renderArticle, renderPage, rss} from "./templates";

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
  const allPages = loaded.filter(isArticle)

  exec(`cp -R public/* gh-pages`)

  allPages
    .filter(a => a.category === 'pages')
    .forEach(p => writePage(outputPath, p, config))

  const articlesDesc = allPages
    .filter(a => a.category !== 'pages')
    .sort((a,b) => +b.date - +a.date)

  const forRendering = withNextLast(articlesDesc)
  forRendering.forEach(article => writeArticle(outputPath, article, config))

  const activeArticles = articlesDesc.filter(a => a.status === 'active')

  // needs to exist on the gh-pages branch, so write each time
  fs.writeFileSync(`${outputPath}/CNAME`, 'www.timr.co')

  fs.writeFileSync(`${outputPath}/index.html`,  layout({
    title: "Tim Ruffles' blog",
    slug: "",
    baseURL: baseURL,
    description: "Tim  Ruffles' blog - software engineering and data-visualization",
    content: homePage(activeArticles.slice(0, 20)),
  }));

  fs.writeFileSync(`${outputPath}/404.html`,  layout({
    title: "Missing",
    slug: "404",
    baseURL: baseURL,
    content: `<h2>I'm sure I put that here</h2>
<p><a href="https://www.google.com/search?as_sitesearch=www.timr.co">Have a search</a>.</p>
<blockquote>And even if by chance he were to utter the final truth, he would not know it: for all is but a woven web of guesses.</blockquote>
<p>Xenophanes</p>`
  }));

  fs.writeFileSync(`${outputPath}/rss.xml`,  rss(activeArticles));
}

async function loadPagesFromDirectory(dir: string, config: Config): Promise<(Article | Error)[]> {
  const files = await promisify(glob)(`${dir}/**/*.txt`)

  const results = await Promise.all(files.map(p => loadPage(p, config)))

  return results
}

function writeHTML(outputPath: string, slug: string, html: string) {
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

function writePage(outputPath: string, article: Article, cfg: Config) {
  const html = layout({
    title: article.title,
    slug: article.slug,
    baseURL: cfg.baseURL,
    content: renderPage(article, cfg),
    description: article.description,
  })
  writeHTML(outputPath, article.slug, html);
}


function writeArticle(outputPath: string, article: ArticleForRendering, cfg: Config) {
  const html = layout({
    title: article.title,
    slug: article.slug,
    baseURL: cfg.baseURL,
    content: renderArticle(article, cfg),
    description: article.description,
  })
  writeHTML(outputPath, article.slug, html);
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

function withNextLast(articlesDescAge: Article[]): ArticleForRendering[] {
  return articlesDescAge.map((page, i) => {
    const r: ArticleForRendering = {...articlesDescAge[i]}
    const prevI = i - 1;
    const nextI = i + 1;

    // prev is newer - descending order
    if(prevI >= 0) {
      r.next = articlesDescAge[prevI]
    }
    if(nextI <= articlesDescAge.length - 1) {
      r.previous = articlesDescAge[nextI]
    }
    return r;
  })
}

function isArticle(e: any): e is Article {return e instanceof Article}
