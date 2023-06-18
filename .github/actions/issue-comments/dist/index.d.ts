declare module 'undefined/index' {
  import { Octokit } from "@octokit/action";
  import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
  export const types: import("arktype").Space<{
      config: {
          contentPath: string;
          issueTitleHandlebars: string;
          issueBodyHandlebars: string;
      };
      contentItem: {
          id: string;
          title: string;
          url: string;
      };
      siteConfig: {
          content: {
              id: string;
              title: string;
              url: string;
          }[];
      };
  }>;
  export type ContentItem = typeof types.contentItem.infer;
  export type SiteConfig = typeof types.siteConfig.infer;
  export type Config = typeof types.config.infer;
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