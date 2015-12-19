PUBLIC_DIR = File.expand_path("..", __FILE__)

module BlogHelpers
  def site_script
    @site_script ||= open(PUBLIC_DIR + "/public/js/dist.js").read;
  end

  def site_style
    @site_style ||= open(PUBLIC_DIR + "/public/dist.css").read;
  end

  def cache *args
    headers['Cache-Control'] = 'public, max-age=43200'
  end
end

