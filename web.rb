#ymlframework
require "bundler"
Bundler.setup
Bundler.require
require "sinatra"
require "erb"
require "digest/md5"
require "ostruct"
require "yaml"
require "pp"
require "redcarpet"
require "set"
require_relative "./db"

# other
require "pathname"

ROOT_DIR = Pathname.new(File.dirname(__FILE__)).realpath
URL = "https://www.truffles.me.uk"

if ENV["DATABASE_URL"]
  db = get_db
end

def load_posts glob, all = false
  files = Dir.glob glob
  modification_times = files.map {|file| File.mtime(file) }.sort {|ta,tb| tb <=> ta }
  items = files.map do |art| 
    load_params(art)
  end.reject do |art|
    art["date"].nil? or art["body"].nil? or art["draft"] or art["title"].nil?
  end.map do |art|
    parse_params art
  end
  items.sort_by!(&:date).reverse!
  OpenStruct.new( :last_modified_at => modification_times.first,
    :items => items,
    :hash => Digest::MD5.hexdigest((items.join('') + modification_times.map(&:to_s).join(''))),
    :by_category => items.group_by {|art| art.category } )
end

def permalinkify text
  text.gsub(' ','-').downcase.gsub(/[^a-z0-9-]/,'').gsub(/-+/,'-')
end

def permalink text
  "#{URL}/#{text}"
end

def load_params article_path
  YAML.load_file(article_path).merge({
    "path" => article_path
  })
rescue StandardError => e
  raise "Invalid article: #{article_path}, #{e}"
end

def parse_params params
  article = OpenStruct.new params
  article_path = article.path
  article.category = article_path.split("/")[1..-2].first.gsub('_',' ').gsub(/\b(\w)/) {|word| word.downcase }
  article.ads_disabled = article.ads_disabled.nil?  ? article.category != "coding" : article.ads_disabled
  article.link ||= permalinkify article.title
  article.date = Date.parse(article.date)
  article.previous_slugs = params["previous_slugs"] || []
  article
rescue StandardError => e
  raise "Invalid article: #{e}\n#{params}"
end


def cache to_hash, date
  # etag Digest::MD5.hexdigest(to_hash.to_s)
  # last_modified date
  headers['Cache-Control'] = 'public, max-age=43200'
end

def make_rss articles
  require 'rss/maker'
  RSS::Maker.make('2.0') do |rss|
    rss.channel.title = "Tim Ruffles's blog"
    rss.channel.link = URL
    rss.channel.description = "truffles.me.uk feed"
    rss.items.do_sort = true
    
    articles.sort {|a,b| b.date <=> a.date }.each do |article|
			unless article.rss
				item = rss.items.new_item
				item.title = article.title
				item.link = permalink article.link
				item.date = (article.date.is_a?(String) ? Time.parse(article.date) : article.date).to_s
			end
    end
  end.to_s
end

articles = load_posts "articles/**/*.txt"
blog_posts = load_posts "blogs/**/*.txt"
pages = load_posts "pages/**/*.txt"

all = articles.items + blog_posts.items + pages.items

postable = articles.items + blog_posts.items
postable.sort_by!(&:date).reverse!
postable_set = Set.new(postable)

get "/" do
  cache articles.hash + blog_posts.hash, [articles.last_modified_at,blog_posts.last_modified_at].max
  @title = "Tim Ruffles"
  @all = postable
  erb :index
end

get "/rss" do
  cache articles.hash + blog_posts.hash, [articles.last_modified_at,blog_posts.last_modified_at].max
  response.headers['content-type'] = 'application/xml;charset=utf-8'
  make_rss(postable)
end


projects = load_posts "projects/projects/*.txt"
get "/projects" do
  @title = "Projects"
  @all = projects
  erb :projects
end

Footnote = Struct.new(:id,:text)

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
  @article = all.find do |art|
    art.link == perma or (art.previous_slugs.find {|slug| slug == perma })
  end


  # TODO this is messy, need better implementation
  if postable_set.include?(@article)
    @previous_article, @next_article = find_next_and_last(@article, postable)
  end

  if @article
    mod_time = File.mtime(@article.path)
    cache @article.body, mod_time
    @body = if @article.template == "erb"
      erb = ERB.new(@article.body)
      erb.result binding
    else
      Redcarpet.new(@article.body).to_html
    end
    @title, @perma, @fb_url, @footnotes = @article.title, @article.link, @article.facebook_comment_url, (@article.footnotes || []).enum_for(:each_with_index).map {|fn,i| Footnote.new(fn.fetch("id","fn-#{i + 1}"),fn.fetch("text")) }
    erb(:show)
  else
    raise Sinatra::NotFound.new
  end
end

# sass handler
get /\/(.*)\.css/ do |stylesheet|
  headers 'Content-Type' => 'text/css; charset=utf-8',
          'Cache-Control' => 'public, max-age=200000'
  sass stylesheet.to_sym
end

not_found do
  @title = "Woops"
  erb :missing
end

def find_next_and_last(article, articles)
  index = articles.index(article) 
  puts "found #{index}" 
  if index
    [articles[index + 1], index == 0 ? nil : articles[index - 1]]
  else
    [nil, nil]
  end
end

def permalink link
  if /^(http|www)/ =~ link
    link
  else
    "#{URL}/#{link.gsub(/^\//,"")}"
  end
end
