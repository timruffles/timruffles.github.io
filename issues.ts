import {Reactions, User} from "./comments";

export interface Issue {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: Label[]
  state: string
  locked: boolean
  assignee: any
  assignees: any[]
  milestone: any
  comments: number
  created_at: string
  updated_at: string
  closed_at: any
  author_association: string
  active_lock_reason: any
  body: any
  reactions: Reactions
  timeline_url: string
  performed_via_github_app: any
  state_reason: any
}


export interface Label {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string
}

