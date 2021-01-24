import {Article} from "./records";
import format from "date-fns/format"
import {Config} from "./build";


export function layout({
 title,
 slug,
 baseURL,
 content,
}: {
  title: string,
  slug: string,
  baseURL: string,
  content: string,
}) {
  const root = slug === ""
  return `<!doctype html>
      <head>
        <title>${title}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="${baseURL}css/normalize.css" type="text/css">
        <link rel="stylesheet" href="${baseURL}css/style.css" type="text/css">
        <link rel="stylesheet" href="${baseURL}css/prism-ghcolors.css" type="text/css">
        <script type="text/javascript">
          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-24335480-1']);
          _gaq.push(['_trackPageview']);

          function asyncScript(src) {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = src;
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          }
          asyncScript(('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js');
        </script>
        <link rel="alternate" type="application/rss+xml" title="Subscribe to RSS feed" href="${baseURL}rss.xml" />
      </head>
      <body class="${root ? "root" : "article"}">
        <div id="mast">
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
        <div id="content" class="reading">
           ${root ? `<div class="page-header">
              <h1><a href="${baseURL}me">Tim Ruffles</a>' Blog</h1>
            </div>` : ''}

           <div id="body">
              ${content}
            </div>
        </div>
        <div class="footer reading">
          <div class="container">
            <p>📩 hello＠timr · co</p>
          </div>
        </div>
      </body>`
}

export function rss(articles: Article[]): string {
  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
    <title>Tim Ruffles' blog</title>
    <link>https://timr.co</link>
    <description>Tim Ruffles' blog</description>
    ${articles.map(article => `<item>
      <title>${escapeXML(article.title)}</title>
      <link>https://timr.co${article.slug}</link>
      <pubDate>${format(article.date, 'EEE, dd MMM yyyy hh::mm:SS', {useAdditionalDayOfYearTokens: false}) + ' GMT'}</pubDate>
      <description>${escapeXML(article.description)}</description>
    </item>`).join('')}
  </channel>
  </rss>`
}

function escapeXML(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c: string): string => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return c
  });
}

export function page(article: Article, cfg: Config): string {
  return `<h1><a href="${article.slug}">${article.title}</a></h1>
  ${article.bodyHTML}
  `
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
