# timr.co

Source code and content for my blog, timr.co.

## Install

```
npm install
```

## Run

```
npm start
```

## Writing posts and pages

Save Markdown files under `articles/`, `blogs/`, or `pages/`. Put YAML
frontmatter with a `title` and `date` at the top, followed by the Markdown body.
The existing YAML `.txt` format is also supported.

```markdown
---
title: An example post
date: 2026-11-13
draft: true
---

Write the post here.
```

## Deploy

Via GitHub Actions - see .github/workflows - and classic 'gh-pages' branch Github pages workflow.

## Comments

Comments hosted on github issues on this repo, and handled
via actions.
