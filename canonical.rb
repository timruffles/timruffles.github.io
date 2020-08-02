class CanonicalHeader
    def initialize(app)
      @app = app
    end

    def call(env)
      status, headers, body = @app.call(env)
      return [status, headers, body] unless headers['Content-Type'] =~ /html/

      headers['Link'] = CanonicalHeader.canonical_tag(env, "timr.co")

      puts headers

      [status, headers, body]
    end

    def self.canonical_tag(env, canonical_host)
      url_scheme = env['HTTP_X_FORWARDED_PROTO'] || env['rack.url_scheme']
      canonical = "#{url_scheme}://#{canonical_host}#{env['SCRIPT_NAME']}#{env['PATH_INFO']}"
      "<#{canonical}>; rel=\"canonical\""
    end
end