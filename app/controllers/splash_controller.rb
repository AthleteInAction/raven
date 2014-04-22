class SplashController < ApplicationController

	def index

		@user = User.new

		if current_user
			redirect_to '/app/#/dashboard'
		else
			
		end

	end

end