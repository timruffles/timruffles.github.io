# only works on osx
.PHONY: start deploy install start

install:
	brew install postgresql && bundle install --path vendor
start:
	bundle exec shotgun web.rb
deploy:
	git push origin master && git push heroku master
