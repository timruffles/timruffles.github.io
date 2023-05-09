import * as github from '@actions/github'
import * as core from '@actions/core'
import {FetchIssuesQuery, getSdk} from './gql.gen'
import { GraphQLClient, gql } from 'graphql-request'
import {attempt, attemptFailed, attemptOk} from "./language"

async function run() {
    const myToken = core.getInput('repoToken')
    const octokit = github.getOctokit(myToken)


    const gqlClient = getSdk(new GraphQLClient('https://api.github.com/graphql', {
        headers: {
            authorization: `Bearer ${myToken}`,
        },
    }))

    // You can also pass in additional options as a second parameter to getOctokit
    // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});
    const [owner, repo] = process.env["GITHUB_REPOSITORY"]!.split("/")
    if (!owner || !repo) throw Error("invalid NWO")


    const issueAttempt = await attempt(() =>
        gqlClient.fetchIssues({
            owner,
            name: repo,
            issueLabel: 'gha-blog-comments',
        })
    )
    if(attemptFailed(issueAttempt)) {
        console.error("failed to fetch issues", issueAttempt)
        return
    }

    console.log(issueAttempt.data)

}


run()

interface NewPage {
    readonly actionType: 'NewArticle'
}

interface ExistingPage {
    readonly actionType: 'ExistingPage'
    readonly slug: string
}

type Action = NewPage | ExistingPage;

