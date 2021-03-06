# config valid only for Capistrano 3.4
lock '3.6.1'

set :application, 'Hotair'
set :repo_url, 'ncgitolite@notioncollective.com:hotairnode'

set :node_bin_path, '/usr/local/bin/node'
set :npm_roles, :web

set :linked_files, %w{.env}

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5

set :keep_releases, ENV['CAP_KEEP_RELEASES'].to_i || 5

namespace :node do

  desc "Start the node application"
  task :start do
    on roles(:app) do
      execute :forever, "start -l /var/log/hotair/forever.log -o /var/log/hotair/out.log -e /var/log/hotair/err.log -a --workingDir #{fetch(:deploy_to)}/current --sourceDir #{fetch(:deploy_to)}/current app.js"
    end
  end


  desc "Stop the node application"
  task :stop do
    on roles(:app) do
      execute :forever, "stop #{fetch(:deploy_to)}/current/app.js"
    end
  end


  desc "Restart the node application"
  task :restart do
    on roles(:app) do
      invoke 'node:stop'
      invoke 'node:start'
    end
  end
end


namespace :deploy do

  desc 'Restart application'

  task :restart do
    invoke 'node:restart'
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end


