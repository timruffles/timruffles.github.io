import {promisify} from 'util'
import yaml from 'yaml'
import fs from 'fs'
import {glob} from "glob";
import {exec} from "child_process";
import {Article} from "./records";
import {
  PaginatedArticle,
  homePage,
  layout,
  renderArticle,
  renderPage,
  rss,
  ArticleForRendering,
  ArticleCommentData
} from "./templates";
import {IssueComment} from "./comments";
import {Issue} from "./issues";
import path from "path";
import {publishedCategories, showOnMainBlog} from "./definitions";

export class Config {
  constructor(readonly baseURL: string) {
  }
}

export async function main(
  publicPath: string,
  outputPath: string,
) {

  // copy public assets
  exec(`cp -R ${publicPath}/* ${outputPath}`)

  const [config, allArticles] = await loadAllContent();

  // output standalone pages
  allArticles
    .filter(a => a.category === 'pages')
    .forEach(p => writePage(outputPath, p, config))

  const mainBlogPosts = allArticles
    .filter(a => showOnMainBlog(a.category))
    .sort((a,b) => +b.date - +a.date)

  const commentsByCommentId = await gatherComments(mainBlogPosts.map(a => a.commentId))

  const tils = allArticles.filter(a => a.category === 'til')

  // render all remaining content
  withNextLast(mainBlogPosts)
    // add TILs - they don't have next/last as there's more important ways to categorise
    .concat(tils)
    .map((a: PaginatedArticle): ArticleForRendering => ({
      ...a,
      comments: (commentsByCommentId.get(a.commentId)?.comments) || [],
      commentHostIssue: commentsByCommentId.get(a.commentId)?.commentHostIssue,
    }))
    .forEach(article => writeArticle(outputPath, article, config))

  const activeArticles = mainBlogPosts.filter(a => a.status === 'active')

  // needs to exist on the gh-pages branch, so write each time
  fs.writeFileSync(`${outputPath}/CNAME`, 'www.timr.co')

  fs.writeFileSync(`${outputPath}/index.html`,  layout({
    title: "Tim Ruffles' blog",
    slug: "",
    baseURL: config.baseURL,
    description: "Tim  Ruffles' blog - software engineering",
    content: homePage(activeArticles.slice(0, 20)),
  }));

  fs.mkdirSync(`${outputPath}/til`)
  fs.writeFileSync(`${outputPath}/til/index.html`,  layout({
    title: "TIL - today I learned",
    slug: "",
    baseURL: config.baseURL,
    description: "Things I've learned",
    content: homePage(tils.slice(0, 20)),
  }));

  fs.writeFileSync(`${outputPath}/404.html`,  layout({
    title: "Missing",
    slug: "404",
    baseURL: config.baseURL,
    content: `<h2>I'm sure I put that here</h2>
<p><a href="https://www.google.com/search?as_sitesearch=www.timr.co">Have a search</a>.</p>
<blockquote>And even if by chance he were to utter the final truth, he would not know it: for all is but a woven web of guesses.</blockquote>
<p>Xenophanes</p>`
  }));

  fs.writeFileSync(`${outputPath}/rss.xml`,  rss(activeArticles));
}

export async function loadAllContent() {
  const baseURL = process.env.BASE_URL || "/";
  const config = new Config(baseURL)

  const contentFolders = Object.keys(publishedCategories);

  const articlesAndErrors = (await Promise.all(contentFolders.map(p =>
    loadActiveContent(p, config)))).flatMap(x => x)
  const errors = articlesAndErrors.filter((e: Article | Error): e is Error => e instanceof Error)
  if (errors.length) {
    console.error("Articles with errors", errors.map(a => a.message))
  }

  // remove errors
  return [config, articlesAndErrors.filter(isArticle)] as const;
}

async function loadActiveContent(dir: string, config: Config): Promise<(Article | Error)[]> {
  const files = await promisify(glob)(`${dir}/**/*.txt`)

  const results = (await Promise.all(files.map(p => loadPage(p, config))))
      .filter(e => e instanceof Error ? true : e.status === 'active')

  return results
}

function writeHTML(outputPath: string, slugWithSlash: string, html: string) {
  const dir = path.join(outputPath, slugWithSlash);
  try {
    fs.mkdirSync(dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  fs.writeFileSync(path.join(dir, "index.html"), html)
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
    comments: article.comments || [],
    commentHostIssue: article.commentHostIssue,
  })
  writeHTML(outputPath, article.slug, html);
}

async function loadPage(path: string, cfg: Config): Promise<Article | Error> {
  const found = fs.readFileSync(path, {encoding: 'utf8'})
  try {
    return Article.fromObject(path, yaml.parse(found), cfg)
  } catch(e) {
    return new ArticleError(e.message, path)
  }
}

class ArticleError extends Error {
  constructor(msg: string, readonly fileName: string) {
    super(fileName + ":" + msg)
  }
}

export function titleToSlug(title: string) {
  return title
    .replace(/ +/g,'-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g,'')
    .replace(/-+/,'-')
}

function withNextLast(articlesDescAge: Article[]): PaginatedArticle[] {
  return articlesDescAge.map((page, i) => {
    const r: PaginatedArticle = {...articlesDescAge[i]}
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

function getCommentPath() {
  return process.env.COMMENT_PATH || "./cache"
}

async function gatherComments(strings: string[])  {
  const files = await promisify(glob)(`${getCommentPath()}/*.json`);
  const res = new Map<string, ArticleCommentData>();
  for(const f of files) {
    const data = fs.readFileSync(f, {encoding: "utf8"})
    const parsed = JSON.parse(data) as { id: string, issue: Issue, comments: IssueComment[] };
    res.set(parsed.id, {
      comments: parsed.comments,
      commentHostIssue: parsed.issue,
    })
  }
  return res;
}

function isArticle(e: any): e is Article {return e instanceof Article}
