# actions-blog-comments

`actions-blog-comments` uses Github issues to power a commenting system for your static site.

## Inputs

### `content-path`

**Required** Location of your site.json. You generate this from your blogging tool - e.g. Jekyll. It lists items of content you'd like to receive comments on.


## Example usage

```yaml
name: Deploy 🚀

on:
  push:
  # run your site deploy on issue comment so it's redeployed after someone comments
  issue_comment:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/checkout@v2
      # output a site.json file containing information on the content you want to receive
      # comments on
      - run: "./scripts/list-contents --site-json-path ${{env.GITHUB_WORKSPACE}}/site.json"
      - uses: timruffles/actions-blog-comments@v1.0.0
        with:
          content-path: "${{env.GITHUB_WORKSPACE}}/site.json"
          output-path: "${{env.GITHUB_WORKSPACE}}/comments.json"
      # build your site, incorporating the generated comments
      - run: "./scripts/build-site --comments ${{env.GITHUB_WORKSPACE}}/comments.json"
      - run: "./scripts/deploy-site"
```

## Development Notes

### Running locally

Input env vars can contain '-', so you need to use `env` to set them:

```sh
env 'INPUT_CONTENT-PATH'=`pwd`/../../../site.json  \
  GITHUB_REPOSITORY=timruffles/timruffles.github.io  \
  GITHUB_TOKEN=a-real-token \
  LOCAL_DEV=1 \
  node  --enable-source-maps dist/index.js path/to/site.json 
```


### node_modules

Everything is in devDependencies because it's rolled up into a single action.
