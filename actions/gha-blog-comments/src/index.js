"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const gql_gen_1 = require("./gql.gen");
const graphql_request_1 = require("graphql-request");
const language_1 = require("./language");
async function run() {
    const myToken = core.getInput('repoToken');
    const octokit = github.getOctokit(myToken);
    const gqlClient = gql_gen_1.getSdk(new graphql_request_1.GraphQLClient('https://api.github.com/graphql', {
        headers: {
            authorization: `Bearer ${myToken}`,
        },
    }));
    // You can also pass in additional options as a second parameter to getOctokit
    // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});
    const [owner, repo] = process.env["GITHUB_REPOSITORY"].split("/");
    if (!owner || !repo)
        throw Error("invalid NWO");
    const issueAttempt = await language_1.attempt(() => gqlClient.fetchIssues({
        owner,
        name: repo,
        issueLabel: 'gha-blog-comments',
    }));
    if (language_1.attemptFailed(issueAttempt)) {
        console.error("failed to fetch issues", issueAttempt);
        return;
    }
    console.log(issueAttempt.data);
}
run();
