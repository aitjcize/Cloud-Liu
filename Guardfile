require 'guard/guard'

module ::Guard
  class TestGuard < ::Guard::Guard
    def run_all
    end

    def run_on_changes(paths)
      `make dev`
    end
  end
end

guard 'TestGuard' do
  watch(%r{js/.+(?<!.min)\.js$})
  watch(%r{css/.+\.css$})
  watch(%r{img/.+\.(jpg|png)})
end

guard 'livereload' do
  watch(%r{.+\.html$})
  watch(%r{js/.+\.js$})
  watch(%r{css/.+\.css$})
  watch(%r{img/.+\.(jpg|png)})
end
