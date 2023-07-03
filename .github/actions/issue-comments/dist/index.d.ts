declare module 'undefined/index' {
  import { Octokit } from "@octokit/action";
  import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
  export type ContentItem = typeof types.contentItem.infer;
  export type SiteContent = typeof types.siteContent.infer;
  export type BuildConfig = typeof types.config.infer;
  export const types: import("arktype").Space<{
      config: {
          contentPath: string;
          outputPath: string;
          issueTitleHandlebars: string;
          issueBodyHandlebars: string;
      };
      contentItem: {
          id: string;
          title: string;
          url: string;
      };
      siteContent: {
          content: {
              id: string;
              title: string;
              url: string;
          }[];
      };
  }>;
  type Issue = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listForRepo"]>[number];
  type IssueComment = GetResponseDataTypeFromEndpointMethod<Octokit["issues"]["listComments"]>[number];
  export interface CachedResponse {
      id: string;
      issue: Issue;
      comments: IssueComment[];
  }
  export {};

}
declare module 'undefined' {
  import main = require('undefined/index');
  export = main;
}