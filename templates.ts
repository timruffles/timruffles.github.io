import {Article} from "./records";
import format from "date-fns/format"


export function layout({
  title,
  slug,
  content,
}: {
  title: string,
  slug: string,
  content: string,
}) {
  const root = slug === ""
  return `<!doctype html>
      <head>
        <title>${title}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="/css/normalize.css" type="text/css">
        <link rel="stylesheet" href="/css/style.css" type="text/css">
        <link rel="stylesheet" href="/css/prism-ghcolors.css" type="text/css">
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
      </head>
      <body class="${root ? "root" : "article"}">
        <div id="mast">
          <div class='top-bar reading'>
              <div class="links logical">
                <div class="navigation logical">
                  <a href="/">Home</a>
                  <a href="https://feeds.feedburner.com/TimRufflesBlog">RSS</a>
                  <a href="/me">
                      ${root ? 'Me' : 'Tim Ruffles'}
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div id="content" class="reading">
           ${root && 
            `<div class="page-header">
              <h1><a href="/me">Tim Ruffles</a>' Blog</h1>
            </div>`}

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

export function homePage(articles: Article[]): string {
  return `<div class="posts">
    ${articles.map(article => `
        <a href="${article.slug}" class=post title="${article.title}">
          <h4>
            ${article.title}
          </h4>
          <span class=date>${formatDate(article.date)}</span>
        </a>
      </div>
    `).join('')}
  </div>`
}

function formatDate(date: Date) {
  return format(date, "dd MMM yy")
}
