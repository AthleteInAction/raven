set :application, "raven"
set :repository,  "git@github.com:onlyexcellence/raven.git"
set :scm, :git
set :branch, "master"

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :user, 'reaper'
set :use_sudo, false
set :deploy_to, "/home/reaper/#{application}"
set :rails_env, "staging"
set :deloy_via, :remote_cache
set :keep_releases, 1
set :migrate_target, :latest
 
default_run_options[:pty] = true
ssh_options[:forward_agent] = true

role :web, "166.78.151.145"                          # Your HTTP server, Apache/etc
role :app, "166.78.151.145"                          # This may be the same as your `Web` server
role :db,  "166.78.151.145", :primary => true		 # This is where Rails migrations will run

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

after 'deploy',"deploy:bundle_it"
after 'deploy:bundle_it',"deploy:rake_it"
after 'deploy:rake_it',"deploy:restart"

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
	task :bundle_it do

		#run "cd #{deploy_to}/current && bundle"

	end
	task :rake_it do

		run "cd #{deploy_to}/current && rake db:migrate"

	end
	task :start do ; end
	task :stop do ; end
	task :restart, :roles => :app, :except => { :no_release => true } do
		run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
	end
end