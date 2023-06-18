# GitHub Actions comments


## Local dev

Input env vars can contain '-', so you need to use `env` to set them:

```sh
env 'INPUT_CONTENT-PATH'=`pwd`/../../../site.json  \
  GITHUB_REPOSITORY=timruffles/timruffles.github.io  \
  GITHUB_TOKEN=a-real-token \
  LOCAL_DEV=1 \
  node  --enable-source-maps dist/index.js path/to/site.json 
```
