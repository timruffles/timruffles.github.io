require "yaml"
require "set"
require "ostruct"


class BlogData

  def articles
    @articles ||= load_posts "articles/**/*.txt"
  end

  def blog_posts
    @blog_posts ||= load_posts "blogs/**/*.txt"
  end

  def pages
    @pages ||= load_posts "pages/**/*.txt"
  end

  def projects
    @projects ||= load_posts "projects/projects/*.txt"
  end

  def all
    @all = articles.items + blog_posts.items + pages.items
  end

  def postable
    if @postable
      @postable
    else
      postable = articles.items + blog_posts.items
      postable.sort_by(&:date).reverse!
      @postable = postable.to_a
    end
  end

  def postable_set
    @postable_set ||= Set.new(postable)
  end

  protected

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
    article.category = article_path.split("/")[1..-2].first.gsub('_',' ').gsub(/\b(\w)/) {|word| word.upcase }
    article.link ||= permalinkify article.title
    article.date = Date.parse(article.date)
    article
  rescue StandardError => e
    raise "Invalid article: #{e}\n#{params}"
  end


  def make_rss articles
    require 'rss/maker'
    RSS::Maker.make('2.0') do |rss|
      rss.channel.title = "Tim Ruffles's blog"
      rss.channel.link = "http://www.truffles.me.uk"
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
      "http://truffles.me.uk/#{link.gsub(/^\//,"")}"
    end
  end
end
