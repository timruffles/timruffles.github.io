import {Octokit} from "@octokit/action"
import * as core from "@actions/core"
import fs from "fs"
import {GetResponseDataTypeFromEndpointMethod,} from "@octokit/types"
import mustache from "mustache"
import {scope} from "arktype";
import {CheckResult} from "arktype/dist/types/traverse/traverse";
import * as util from "util";

// label set on issues to identify them as managed by this action
const commentLabel = 'ghs-comments' as const;

export type ContentItem = typeof types.contentItem.infer;
export type SiteContent = typeof types.siteContent.infer;
export type BuildConfig = typeof types.config.infer

export const types = scope({
  config: {
    // where the site.json resides
    contentPath: 'string>1',
    // where the comments will be written
    outputPath: 'string>1',
    // commentTitleHandlebars for the issue title
    issueTitleHandlebars: 'string>1',
    // commentHandlebars template defines the template for creating the body
    // of a comment
    issueBodyHandlebars: 'string>1'
  },
  contentItem: {
    id: '0<string<51',
    title: '0<string<255',
    url: '0<string<2048',
  },
  siteContent: {
    content: 'contentItem[]',
  },
}).compile()


function main() {
  (process.env.LOCAL_DEV
    ? localDev()
    : action())
      .catch(e => {
        console.error("unexpected error", util.inspect(e, false, 10))
        process.exitCode = 1;
      })
}

type Issue = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listForRepo"]>[number];
type IssueComment = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listComments"]>[number];

async function localDev() {
  process.env.GITHUB_ACTION = "true";
  process.env['INPUT_ISSUE-BODY-HANDLEBARS'] = `The comment thread for [{{title}}]({{url}}). Leave a comment below and it'll appear on the site in a few minutes.`
  process.env['INPUT_ISSUE-TITLE-HANDLEBARS'] = `Comments for '{{title}}'`
  return await action()
}

function must<T>(contentItem: CheckResult<T>): T {
  if (contentItem.problems) {
    throw Error("invalid input: " + contentItem.problems.join(","))
  }
  return contentItem.data
}

async function action() {
  // TODO input

  const bodyTpl = core.getInput("issue-body-handlebars")
  const titleTpl = core.getInput("issue-title-handlebars")
  const input = must(types.config({
    contentPath: core.getInput('content-path'),
    outputPath: core.getInput('output-path') || "./cache",
    issueBodyHandlebars: bodyTpl,
    issueTitleHandlebars: titleTpl,
  }))


  const jsonStr = fs.readFileSync(input.contentPath, {encoding: "utf8"})
  const configRaw = JSON.parse(jsonStr)
  const siteContent = must(types.siteContent(configRaw))

  return await synchronise(
    siteContent,
    input,
  )
}

interface IssueCreateInput {
  title: string
  body: string
  labels: string[]
}


async function synchronise(
  site: SiteContent,
  config: BuildConfig,
) {
  const api = new Octokit()

  const repoNWO = process.env.GITHUB_REPOSITORY;
  if (!repoNWO) throw Error("GITHUB_REPOSITORY unset")
  const parts = repoNWO.split("/");
  if (parts.length !== 2) throw Error("unexpected GITHUB_REPOSITORY value")
  const [owner = "", repoName = ""] = parts;

  const issues = await api.issues.listForRepo({
    owner,
    repo: repoName,
    labels: commentLabel,
    state: "open",
  });

  const issuesOnly = issues.data.filter(i => !i.pull_request);

  const byId = issuesOnly.reduce((a, i) => {
    const pathLabels = i.labels.map(l =>
      (typeof l === "string" ? l : l.name) || "");
    const hasId = pathLabels.find(p => p.startsWith("id:"));
    if (!hasId) {
      return a
    }
    const idValue = hasId.replace(/^id:/, "")
    a[idValue] = i;
    return a;
  }, {} as { [k: string]: Issue });

  const missing = site.content.filter(p => !byId[p.id]);

  mustache.parse(config.issueTitleHandlebars);
  mustache.parse(config.issueBodyHandlebars);

  const createInputAndErrors = missing.map((item): Error | IssueCreateInput => {
    try {
      return {
        title: mustache.render(config.issueTitleHandlebars, item),
        body: mustache.render(config.issueBodyHandlebars, item),
        labels: [
          commentLabel,
          `id:${item.id}`,
        ],
      };
    } catch (e) {
      return e instanceof Error ? e : Error(`${e}`)
    }
  });

  const errs = createInputAndErrors.filter(a => a instanceof Error)
  if (errs.length) {
    console.error("failed to generate issues: ", errs.join("\n"))
    process.exit(1)
  }

  const createInputs = createInputAndErrors.filter((a): a is IssueCreateInput => !(a instanceof Error))

  async function createIssues() {
    for (const input of createInputs) {
      const res = await api.issues.create({
        repo: repoName,
        owner,
        title: input.title,
        body: input.body,
        labels: input.labels,
      })
      console.log("created comment issue", {
        title: input.title,
        url: res.data.html_url,
      })
      // store issue so we can cache it below
      byId[res.data.id] = res.data;
    }
  }

  console.log("generating issues for", createInputs.length, "content items")

  await createIssues()

  console.log("downloading and caching issues for site build")

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

  for (const [path, issue] of Object.entries(byId)) {
    fs.writeFileSync(`${config.outputPath}/${issue.node_id}.json`, JSON.stringify({
      id: path,
      issue,
      comments: commentsByIssueID.get(issue.url) || [],
    }, null, 4), {encoding: "utf-8"})
  }
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

main();
