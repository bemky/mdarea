# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

set :source, 'docs-src'
set :build_dir, 'docs'

activate :condenser do |config|
  config.path = Dir.each_child(UniformUi::ASSET_PATH).map { |a| File.join(UniformUi::ASSET_PATH, a) }
  config.path += ['./lib']
end
app.condenser.register_postprocessor('text/css', ::Condenser::CSSMediaCombinerProcessor)
app.condenser.unregister_preprocessor('application/javascript')
app.condenser.register_preprocessor('application/javascript', ::Condenser::JSAnalyzer)
app.condenser.register_preprocessor('application/javascript', ::Condenser::BabelProcessor.new(File.expand_path('./'),  {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-export-default-from',
    ["@babel/plugin-transform-runtime", { corejs: 3, useESModules: true }]
  ],
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: { browsers: '> 1% and not dead' }
    }]
  ]
}))
app.condenser.unregister_minifier('application/javascript')

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

helpers do
  
  def capture_html(**args, &block)
    html = if handler = auto_find_proper_handler(&block)
      handler.capture_from_template(**args, &block)
    else
      yield(**args)
    end
    
    spaces = html.match(/^ +/)
    if spaces
      spaces = spaces[0]
      count = spaces.scan(/ /).count
      html = html.gsub(/^ {#{count}}/, "")
    end
    html = html.strip
    
    ::ActiveSupport::SafeBuffer.new.safe_concat(html)
  end
  alias html_block capture_html
  
  def code(language=nil, options={}, &block)
    raise 'The code helper requires a block to be provided.' unless block_given?
    @_out_buf, _buf_was = "", @_out_buf
    
    begin
      content = capture_html(&block)
    ensure
      # Reset stored buffer
      @_out_buf = _buf_was
    end
    
    content = content.encode(Encoding::UTF_8)
    concat_content Middleman::Syntax::Highlighter.highlight(content, language, options).html_safe
  end
  
end

# configure :build do
#   app.condenser.register_postprocessor('text/css', ::Condenser::PurgeCSSProcessor.new(app.condenser.npm_path, {
#     content: [File.expand_path('./docs/**/*.html'), File.expand_path('./docs-src/assets/javascripts/**/*.js')],
#     safelist: ["/hljs*/", "/.*code.*/"]
#   }))
# end

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end
