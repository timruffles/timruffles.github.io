import {loadArticles} from "./src/build-system";

main()

async function main() {
  const [config, articles] = await loadArticles();

  const forOutput = articles.filter(a => a.status === 'active' && a.category !== 'pages')
    .map(a => (
      {
        title: a.title,
        url: `https://www.timr.co${a.slug}`,
        // slugs are stable. Missing the 'base64url' value in typings
        id: a.commentId,
      }
    ))

  console.log(JSON.stringify({
    content: forOutput.slice(0,2),
  }, null, 4))
}
