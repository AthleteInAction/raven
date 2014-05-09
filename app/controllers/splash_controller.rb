class SplashController < ApplicationController

	def index

		@user = User.new

		if current_user
			redirect_to '/app/#/calendar'
		else
			
		end

	end

end