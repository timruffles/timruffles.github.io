#framework
require "rubygems"
require "sinatra"
require "erb"
require "digest/md5"
require "ostruct"
require "yaml"
require "pp"
require "redcarpet"

# other
require "pathname"

ROOT_DIR = Pathname.new(File.dirname(__FILE__)).realpath
URL = "http://www.truffles.me.uk"

def load glob
  files = Dir.glob glob
  modification_times = files.map {|file| File.mtime(file) }.sort {|ta,tb| tb <=> ta }
  OpenStruct.new( :last_modified_at => modification_times.first,
    :items => (items = files.map {|art| extract_params(art) }.reject(&:draft).select(&:body)),
    :hash => Digest::MD5.hexdigest((items.join('') + modification_times.map(&:to_s).join(''))),
    :by_category => items.group_by {|art| art.category } )
end

def permalinkify text
  text.gsub(' ','-').downcase.gsub(/[^a-z0-9-]/,'').gsub(/-+/,'-')
end

def permalink text
  "#{URL}/#{text}"
end

def extract_params article_path
  article = OpenStruct.new YAML.load_file(article_path)
  article.path = article_path
  article.category = article_path.split("/")[1..-2].first.gsub('_',' ').gsub(/\b(\w)/) {|word| word.upcase }
  article.link = permalinkify article.title
  article.date = article.date || File.mtime(article_path)
  article
end


def cache to_hash, date
  # etag Digest::MD5.hexdigest(to_hash.to_s)
  # last_modified date
  headers['Cache-Control'] = 'public, max-age=43200'
end

def make_rss articles
  require 'rss/maker'
  RSS::Maker.make('2.0') do |rss|
    rss.channel.title = "dil·et·tant·ism"
    rss.channel.link = "http://www.truffles.me.uk"
    rss.channel.description = "dil·et·tant·ism feed"
    rss.items.do_sort = true
    
    articles.each do |article|
      item = rss.items.new_item
      item.title = article.title
      item.link = permalink article.link
      item.date = Time.parse(article.date)
    end
  end.to_s
end

articles = load "articles/**/*.txt"
blog_posts = load "blogs/**/*.txt"
all = articles.items + blog_posts.items

get "/" do
  cache articles.hash + blog_posts.hash, [articles.last_modified_at,blog_posts.last_modified_at].max
  @title = "dil·et·tant·ism"
  @blog_posts = blog_posts
  @articles = articles
  erb :index
end

get "/rss" do
  cache articles.hash + blog_posts.hash, [articles.last_modified_at,blog_posts.last_modified_at].max
  make_rss(all)
end

get "/:article" do |perma|
  @article = all.find {|art| art.link == perma}
  if @article
    mod_time = File.mtime(@article.path)
    cache @article.body, mod_time
    @title, @body, @perma = @article.title,  Redcarpet.new(@article.body).to_html, @article.link
    erb :show
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