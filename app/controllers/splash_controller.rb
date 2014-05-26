class SplashController < ApplicationController

	def index

		@user = User.new

		if current_user
			redirect_to '/app/#/calendar'
		else
			render 'index',layout: 'splash'
		end

	end

end