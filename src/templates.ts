import {Article} from "./records";
import format from "date-fns/format"
import {Config} from "./build-system";
import {IssueComment} from "./comments";
import {Issue} from "./issues";


export function layout({
                         title,
                         slug,
                         baseURL,
                         content,
                         description = '',
                         comments = [],
                         commentHostIssue,
                       }: {
  title: string,
  slug: string,
  baseURL: string,
  content: string,
  description?: string,
  comments?: IssueComment[],
  commentHostIssue?: Issue | undefined,
}) {
  const root = slug === ""
  return `<!doctype html>
      <head>
        <title>${title}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        ${description ? `<meta name="description" content="${escapeXML(description)}" >` : ''}
        <link rel="stylesheet" href="${baseURL}css/normalize.css" type="text/css">
        <link rel="stylesheet" href="${baseURL}css/style.css" type="text/css">
        <link rel="stylesheet" href="${baseURL}css/prism-ghcolors.css" type="text/css">
        <link rel="alternate" type="application/rss+xml" title="Subscribe to RSS feed" href="${baseURL}rss.xml" />
      </head>
      <body class="${root ? "root" : "article"}">
        <div class="mast">
          <div class='top-bar reading'>
              <div class="links logical">
                <div class="navigation logical">
                  <a href="${baseURL}">Home</a>
                  <a href="${baseURL}rss.xml">RSS</a>
                  <a href="${baseURL}me">
                      ${root ? 'Me' : 'Tim Ruffles'}
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div class="content" class="reading">
           ${root ? `<div class="page-header">
              <h1><a href="${baseURL}me">Tim Ruffles</a>' Blog</h1>
            </div>` : ''}

           <div class="body">
              ${content}
            </div>
        </div>
        <div class="footer reading">
          <div class="container">
            <p>📩 hello＠timr · co</p>
          </div>
        </div>
      </body><!-- built from ${process.env.GITHUB_SHA || 'unknown version'} -->`
}

function renderComments(issue: Issue, comments: IssueComment[]) {
  return `<div class="comments">
        ${comments.map(renderComment).join("\n")}
        <p class="comment-help">
            <a href="${issue.html_url}" title="Comments handled via Github">
              Leave a comment via Github
            </a> 💬 
        </p>
  </div>`;
}

function renderComment(comment: IssueComment) {
  return `<div class="comment">
  <div class="comment-heading">
    <img src="${comment.user.avatar_url}" width="32" height="32" />
    <div class="comment-info">
      <a href="${comment.user.html_url}" class="comment-author" title="See author on github">${comment.user.login}</span></a>
      <a class="comment-time" href="${comment.html_url}" title="View comment on github">${
    format(new Date(Date.parse(comment.created_at)), 'dd MMM yy, h:sbbb') + ' UTC'
  }</a>
    </div>
  </div>
  <div class="comment-body">
    <p>
      ${comment.body}
    </p>
  </div>
</div>`
}

// canonical host — matches CNAME (www.timr.co)
const SITE = 'https://www.timr.co'

export function rss(articles: Article[]): string {
  const items = articles.map(article => {
    const url = `${SITE}${article.slug}`
    return `    <item>
      <title>${escapeXML(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(article.date)}</pubDate>
      <description>${escapeXML(article.description)}</description>
    </item>`
  }).join('\n')

  // articles arrive newest-first
  const updated = rfc822(articles.length ? articles[0].date : new Date(0))

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tim Ruffles' blog</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Tim Ruffles' blog</description>
    <language>en-GB</language>
    <lastBuildDate>${updated}</lastBuildDate>
${items}
  </channel>
</rss>`
}

// RFC-822 date, e.g. "Fri, 27 Sep 2019 00:00:00 +0000"
function rfc822(date: Date): string {
  return format(date, "EEE, dd MMM yyyy HH:mm:ss") + " +0000"
}

function escapeXML(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c: string): string => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
    }
    return c
  });
}

function articleFooter(article: ArticleForRendering, cfg: Config) {
  return `<div class="article-footer">
  ${article.next ? `<p class=nav>
    Next: <a href="${article.next.slug}">
      ${article.next.title}
    </a>
    </p>` : ''}
  ${article.previous ? `<p class=nav>
    Previous: <a href="${article.previous.slug}">
      ${article.previous.title}
    </a>
    </p>` : ''}
        ${article.commentHostIssue
    ? renderComments(article.commentHostIssue, article.comments)
    : ""}
    </div>`
}

export function renderPage(article: Article, cfg: Config): string {
  return `<h1><a href="${article.slug}">${article.title}</a></h1>
  ${article.bodyHTML}`
}

export function renderArticle(article: ArticleForRendering, cfg: Config): string {
  return `<h1><a href="${article.slug}">${article.title}</a></h1>
  ${article.bodyHTML}
  ${articleFooter(article, cfg)}`
}

export function homePage(articles: Article[]): string {
  return `<div class="posts">
    ${articles.map(article => `
        <a href="${article.slug}" class=post title="${article.title}">
        
          <h4>
            ${article.title}
          </h4>
          <span class=date>${formatDate(article.date)}</span>
        </a>
    `).join('')}
  </div>`
}

function formatDate(date: Date) {
  return format(date, "dd MMM yy")
}

export interface PaginatedArticle extends Article {
  next?: PaginatedArticle
  previous?: PaginatedArticle
}

export interface ArticleCommentData {
  comments: IssueComment[]
  commentHostIssue: Issue | undefined
}

export interface ArticleForRendering extends PaginatedArticle, ArticleCommentData {
}
