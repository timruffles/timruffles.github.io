# Code generation only

help:
	@echo makefile only used for code-generation targets - see scripts/ and package.json

# generate GQL typings for GH API, and graphql queries defined in .gql files
gqlDeps := $(wildcard gql/*.gql)
src/gql.gen.ts: vendor/github-schema.graphql $(gqlDeps)
	graphql-codegen -c github-graphql-codegen.yml

vendor/github-schema.graphql:
	mkdir -p vendor
	curl https://docs.github.com/public/schema.docs.graphql > $@

index.js:
	tsc