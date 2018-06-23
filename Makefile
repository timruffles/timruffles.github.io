

.PHONY: start deploy install start

install:
	bundle install --path vendor
start:
	bundle exec shotgun web.rb
deploy:
	git push origin master && git push heroku master
