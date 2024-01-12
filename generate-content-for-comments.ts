import {loadAllContent} from "./src/build-system";
import {isCommentable} from "./src/definitions";

main()

async function main() {
  const [config, articles] = await loadAllContent();

  const cutoffForComments = new Date(Date.parse('2015-01-01'));

  const forOutput = articles.filter(a => a.status === 'active' && isCommentable(a.category))
    .filter(a => a.date > cutoffForComments)
    .map(a => (
      {
        title: a.title,
        url: `https://www.timr.co${a.slug}`,
        // slugs are stable. Missing the 'base64url' value in typings
        id: a.commentId,
      }
    ))

  console.log(JSON.stringify({
    content: forOutput,
  }, null, 4))
}
