class UsersController < ApplicationController

	before_filter :authorize, only: [:edit,:update,:index,:destroy]

	def index

		@user = User.all

	end

	def new

		@user = User.new

	end

	def create

		@user = User.new params[:user]
		if @user.save
			#UserMailer.new_user(@user).deliver
			session[:user_id] = @user.id
			redirect_to root_url
		else
			render 'new'
		end

	end

end