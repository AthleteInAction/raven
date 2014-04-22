module Api
  module V1
  	class CommentsController < ApplicationController

  		def index

  			@comments = Comment.where(event_id: params[:event_id]).order(:created_at => :desc)

  			render json: @comments

  		end

  		def create

  			params[:comment][:user_id] = current_user.id
  			params[:comment][:event_id] = params[:event_id]

  			@comment = Comment.new params[:comment]

  			if @comment.save
  				render json: @comment
  			else
  				render json: {error: true}
  			end

  		end

  	end
  end
end