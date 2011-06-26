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
  article.link = permalink article.title
  article
end

def permalink text
  text.gsub(' ','-').downcase.gsub(/[^a-z0-9-]/,'').gsub(/-+/,'-')
end

def load
  articles = Dir.glob("articles/**/*.txt")
  modification_times = articles.sort {|file,file2| File.mtime(file) <=> File.mtime(file2) }
  last_modified_at = modification_times.last
  @articles = articles.map {|art| extract_params(art) }
  @articles_by_category = @articles.group_by {|art| art.category }
end

get "/" do
  load
  # last_modified last_modified_at
  # etag Digest::MD5.hexdigest((articles.join('') + modification_times.map(&:to_s).join('')))
  erb :index
end

get "/:article" do |perma|
  load
  @article = @articles.find {|art| art.link == perma}
  if @article
    mod_time = File.mtime(@article.path)
    # last_modified mod_time
    # etag Digest::MD5.hexdigest(mod_time)
    @title, @body, @perma = @article.title,  Redcarpet.new(@article.body).to_html, @article.link
    erb :show
  else
    raise Sinatra::NotFound.new
  end
end

not_found do
  erb :missing
end