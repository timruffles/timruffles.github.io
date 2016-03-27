require "yaml"
require "set"
require "ostruct"


class BlogData

  def articles
    @articles ||= (
      as = load_posts "articles/**/*.txt", type: "post"
      as.sort_by!(&:date)
      as.reverse!
      as.each_cons(2) do |nxt, prev|
        prev[:next] = nxt
        nxt[:previous] = prev
      end
      as
    )
  end

  def pages
    @pages ||= load_posts "pages/**/*.txt", type: "page"
  end

  def projects
    @projects ||= load_posts "projects/projects/*.txt", type: "project"
  end

  def by_slug
    @by_slug ||= Hash[all.map {|p| [p.link, p] }]
  end

  protected

  def all
    @all ||= articles + pages
  end

  def load_posts glob, opts = {}
    files = Dir.glob glob

    files.map do |art| 
      load_params(art)
    end.reject do |art|
      art["date"].nil? or art["body"].nil? or art["draft"] or art["title"].nil?
    end.map do |art|
      parse_params art.merge(opts)
    end
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

  def permalink link
    if /^(http|www)/ =~ link
      link
    else
      "http://truffles.me.uk/#{link.gsub(/^\//,"")}"
    end
  end
end
