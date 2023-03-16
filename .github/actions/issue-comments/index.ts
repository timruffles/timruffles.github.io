import core from "@actions/core"
import {Octokit} from "@octokit/action"
import fs from "fs"
import {
  GetResponseTypeFromEndpointMethod,
  GetResponseDataTypeFromEndpointMethod,
} from "@octokit/types"
import {
  RestEndpointMethodTypes
} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types";

main();

function main() {
  if (process.env.LOCAL_DEV) {
    return localDev()
      .catch(e => {
        console.error("unexpected error", e)
        process.exitCode = 1;
      })
  }
  throw Error("todo")
}

type Issue = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listForRepo"]>[number];
type IssueComment = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listComments"]>[number];

async function localDev() {
  process.env.GITHUB_ACTION = "true";
  return await synchronise(["/example/path"])
}


async function synchronise(
  contentPaths: string[],
) {
  // sync:
  // - accept validate content URL
  // - ensure existing issues for all of them
  const api = new Octokit()

  const repoNWO = process.env.GITHUB_REPOSITORY;
  if (!repoNWO) throw Error("GITHUB_REPOSITORY unset")
  const [owner, repoName] = repoNWO.split("/")

  const issues = await api.issues.listForRepo({
    owner,
    repo: repoName,
    labels: "gha-blog-comments",
  });

  const issuesOnly = issues.data.filter(i => !i.pull_request);

  const byPath = issuesOnly.reduce((a, i) => {
    const pathLabels = i.labels.map(l =>
      (typeof l === "string" ? l : l.name) || "");
    const hasPath = pathLabels.find(p => p.startsWith("path:"));
    if (!hasPath) {
      return a
    }
    const pathData = hasPath.replace(/^path:/, "")
    a[pathData] = i;
    return a;
  }, {} as { [k: string]: Issue });

  const missing = contentPaths.filter(p => !byPath[p]);
  //   - generate new issues if missing
  console.log("need to generate issues for", missing)

  const issuesByURL = new Map(issuesOnly.map(i => [i.url, i]));

  // TODO pagination
  const comments = await api.issues.listCommentsForRepo({
    repo: repoName,
    owner,
    per_page: 100,
  });

  const commentsByIssueID = new Map<string, IssueComment[]>()

  for (const cmt of comments.data) {
    if (!commentsByIssueID.has(cmt.issue_url)) {
      commentsByIssueID.set(cmt.issue_url, []);
    }
    commentsByIssueID.get(cmt.issue_url)!.push(cmt)
  }

  // - identify new comments to download
  for (const [path, issue] of Object.entries(byPath)) {
    fs.writeFileSync(`./cache/${issue.node_id}.json`, JSON.stringify({
      id: path,
      issue,
      comments: commentsByIssueID.get(issue.url) || [],
    }, null, 4), {encoding: "utf-8"})
  }
  // - run build with comment data
}


export interface CachedResponse {
  id: string
  issue: Issue
  comments: IssueComment[]
}

// V2: storage
// storage:
// - use a detached branch
// - use github actions build caches (harder to develop locally)
