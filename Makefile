

.PHONY: run deploy install

install:
	bundle install --path vendor
run:
	bundle exec shotgun web.rb
deploy:
	git push origin master && git push heroku master
