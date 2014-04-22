module Api
  module V1
  	class UsersController < ApplicationController

  		def index

  			@users = User.all

  			render json: @users

  		end

  		def show

  			params[:id] = current_user.id if params[:id].to_s.downcase == 'me'

  			@user = User.find(params[:id])

  			render json: @user

  		end

      def update

        @user = User.find(params[:id])

        if @user.update_attributes(params[:user])

          render json: @user

        else

          render json: @user.errors,status: :unprocessable_entity
          
        end

      end

  	end
  end
end