require 'web'
run Sinatra::Application

use Sass::Plugin::Rack
configure :production do
  use Rack::Static,
      :urls => ['/css'],
      :root => File.expand_path('../tmp', __FILE__)

  Sass::Plugin.options.merge!(:template_location => 'views/sass',
                              :css_location => 'tmp/css')
end