#ymlframework

#
# load global bits, then pull in the various sub-systems
#

require "bundler"
Bundler.setup
Bundler.require

require "sinatra"

require "pp"

require_relative "./db"
require_relative "./helpers"
require_relative "./data"

require "redcarpet"
require "erb"
require "digest/md5"

URL = "http://www.truffles.me.uk"

if ENV["DATABASE_URL"]
  db = get_db
end

data = BlogData.new
Footnote = Struct.new(:id,:text)

helpers BlogHelpers

get "/" do
  cache data.articles.hash
  @title = "Tim Ruffles"
  @all = data.articles
  erb :index
end

get "/rss" do
  cache data.articles.hash
  make_rss(data.articles)
end


get "/projects" do
  @title = "Projects"
  @all = data.projects
  erb :projects
end

get "/l/:name" do |name|
  results = db.exec_params("SELECT url FROM links WHERE name = $1",[name])
  if results.num_tuples == 0
    raise Sinatra::NotFound.new
  else
    url = results[0]["url"]

    # might want to change where the resource is in future
    status 307

    # According to RFC 2616 section 14.30, "the field value consists of a
    # single absolute URI"
    response['Location'] = uri(url, settings.absolute_redirects?, settings.prefixed_redirects?)
    halt()
  end
end

get "/:article" do |perma|
  @article = data.by_slug[perma]

  unless @article
    raise Sinatra::NotFound.new
  end

  mod_time = File.mtime(@article.path)
  cache @article.body, mod_time
  @body = if @article.template == "erb"
    erb = ERB.new(@article.body)
    erb.result binding
  else
    Redcarpet.new(@article.body).to_html
  end

  @title = @article.title
  @perma = @article.link
  @footnotes = (@article.footnotes || []).enum_for(:each_with_index).map do |fn,i|
    Footnote.new(fn.fetch("id","fn-#{i + 1}"),fn.fetch("text"))
  end

  erb(:show)
end

not_found do
  @title = "Woops"
  erb :missing
end


