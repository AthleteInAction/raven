class InvitationsController < ApplicationController

  		def index

  			@invitations = Invitation.all
  			
  			render json: @invitations

  		end


  		def create

  			render json: params

  		end

  		def update

  			@invitation = Invitation.find(params[:id])
  			if @invitation.update_attributes(params[:invitation])
  				render json: {invitation: @invitation},status: 200
  			else
  				render json: {error: true},status: :unprocessable_entity
  			end

  		end

  	end