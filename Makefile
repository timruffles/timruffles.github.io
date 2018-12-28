# only works on osx
.PHONY: start deploy install start

ruby_deps: Gemfile
	bundle install --path vendor

install: ruby_deps
	brew install postgresql

start:
	bundle exec shotgun web.rb
deploy:
	git push origin master && git push heroku master
