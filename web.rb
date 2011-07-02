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

def extract_params article_path
  article = OpenStruct.new YAML.load_file(article_path)
  article.path = article_path
  article.category = article_path.split("/")[1..-2].first.gsub('_',' ').gsub(/\b(\w)/) {|word| word.upcase }
  article.link = permalinkify article.title
  article
end

def permalinkify text
  text.gsub(' ','-').downcase.gsub(/[^a-z0-9-]/,'').gsub(/-+/,'-')
end

def permalink text
  "http://www.truffles.me.uk/#{text}"
end

def load
  articles = Dir.glob("articles/**/*.txt")
  modification_times = (Dir.glob("views/*.erb") + articles).map {|file| File.mtime(file) }.sort {|ta,tb| tb <=> ta }
  @last_modified_at = modification_times.first
  @articles_hash = Digest::MD5.hexdigest((articles.join('') + modification_times.map(&:to_s).join('')))
  @articles = articles.map {|art| extract_params(art) }
  @articles_by_category = @articles.group_by {|art| art.category }
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

get "/" do
  load
  last_modified @last_modified_at
  etag @articles_hash
  @title = "dil·et·tant·ism"
  erb :index
end

get "/rss" do
  load
  last_modified @last_modified_at
  etag @articles_hash
  make_rss(@articles)
end

get "/:article" do |perma|
  load
  @article = @articles.find {|art| art.link == perma}
  if @article
    mod_time = File.mtime(@article.path)
    # last_modified mod_time
    # etag Digest::MD5.hexdigest(@article.body)
    @title, @body, @perma = @article.title,  Redcarpet.new(@article.body).to_html, @article.link
    erb :show
  else
    raise Sinatra::NotFound.new
  end
end

# sass handler
get /\/(.*)\.css/ do |stylesheet|
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass stylesheet.to_sym
end

not_found do
  @title = "Woops"
  erb :missing
end