require 'rubygems'
require 'yaml'
PROJECT_ROOT = File.expand_path('..', __FILE__)

desc "build knockback.js and knockback.min.js"
task :build do
  begin
    exec "cd #{PROJECT_ROOT}; ruby script/build.rb"
  rescue LoadError
    puts "build failed: ensure you have coffee-script ('npm install coffee-script -g') and jammit ('(sudo) gem install jammit') installed"
    exit
  end
end

desc "watch for file changes, and rebuild all src and spec files when they do"
task :watch do
  begin
    exec "cd #{PROJECT_ROOT}; ruby script/watch.rb"
  rescue LoadError
    puts "build failed: ensure you have coffee-script ('npm install coffee-script -g') and jammit ('(sudo) gem install jammit') installed"
    exit
  end
end

desc "clean all the temporary files in knockback.js"
task :clean do
  begin
    exec "cd #{PROJECT_ROOT}; ruby script/clean.rb"
  end
end

desc "clean, build, and minimize"
task :package do
  begin
    fork { exec "cd #{PROJECT_ROOT} ruby script/clean.rb; ruby script/build.rb" }
    Process.waitall
  rescue LoadError
    puts "build failed: ensure you have coffee-script ('npm install coffee-script -g') and jammit ('(sudo) gem install jammit') installed"
    exit
  end
end
