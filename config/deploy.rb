set :application, "raven"
set :repository, "git@github.com:onlyexcellence/raven.git"
 
set :scm, 'git'
 
set :user, 'reaper'
set :branch, "master"
 
set :git_shallow_clone, 1
set :use_sudo, false
set :deploy_to, "/home/reaper/#{application}"
set :deloy_via, :remote_cache
set :keep_releases, 1
set :rails_env, "production"
set :migrate_target, :latest
 
default_run_options[:pty] = true
ssh_options[:forward_agent] = true
 
 
role :web, "166.78.151.145" # Your HTTP server, Apache/etc
role :app, "166.78.151.145" # This may be the same as your `Web` server
role :db, "localhost", :primary => true # This is where Rails migrations will run
 
 
 namespace :deploy do
   task :start do ; end
   task :stop do ; end
   task :restart, :roles => :app, :except => { :no_release => true } do
     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
   end
 end
 
 namespace :deploy do
   desc "Recreate symlink"
   task :resymlink, :roles => :app do
     run "rm -f #{current_path} && ln -s #{release_path} #{current_path}"
   end
 end