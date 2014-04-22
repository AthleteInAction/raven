module Api
  module V1
  	class InvitationsController < ApplicationController

  		def index

  			@invitations = Invitation.where event_id: params[:event_id],itype: 'event'
  			#@invitations = User.find_by_sql("SELECT i.id AS id,i.event_id AS event_id,u.id AS user_id,u.email,u.last_login,u.confirmed,i.created_at,i.updated_at FROM invitations i JOIN users u ON u.id = i.invitee_id WHERE i.itype = 'event' AND i.event_id = #{params[:event_id]} AND u.id != #{current_user.id} ORDER BY u.name ASC,u.email ASC")
  			
  			render json: @invitations

  		end


  		def create

        if params[:invitation][:invitee_id]

          if params[:invitation][:invitee_id] == current_user.id
            params[:invitation][:role] = 'creator'
          else
            params[:invitation][:role] = 'invitee'
          end

          @invitation = Invitation.new params[:invitation]

          if @invitation.save
            
            user = User.find @invitation.invitee_id

            render json: {invitation: InvitationSerializer.new(@invitation,root: false),user: UserSerializer.new(user,root: false)},status: 201

          else
            
            render json: @invitation.errors,status: :unprocessable_entity

          end

        elsif params[:invitation][:email]

          @user = User.find_by_email params[:invitation][:email]

          if @user

            if @user.id == current_user.id
              params[:invitation][:role] = 'creator'
            else
              params[:invitation][:role] = 'invitee'
            end

            @invitation = Invitation.new(event_id: params[:invitation][:event_id],user_id: current_user.id,invitee_id: @user.id,role: params[:invitation][:role])

            if @invitation.save

              Contact.new(user_id: current_user.id,contact_id: @user.id).save

              render json: {invitation: InvitationSerializer.new(@invitation,root: false),user: UserSerializer.new(@user,root: false)},status: 201

            else
              
              render json: @invitation.errors,status: :unprocessable_entity

            end

          else

            newUser = User.new(email: params[:invitation][:email],password: 'xxx')

            if newUser.save

              @invitation = Invitation.new(event_id: params[:invitation][:event_id],user_id: current_user.id,invitee_id: newUser.id,role: 'invitee')

              if @invitation.save

                Contact.new(user_id: current_user.id,contact_id: newUser.id).save

                render json: {invitation: InvitationSerializer.new(@invitation,root: false),user: UserSerializer.new(newUser,root: false)},status: 201

              else
                
                render json: @invitation.errors,status: :unprocessable_entity

              end

            else

              render json: newUser.errors,status: :unprocessable_entity

            end

          end

        end

  		end

  		def update

  			@invitation = Invitation.find(params[:id])
  			if @invitation.update_attributes(params[:invitation])
  				render json: {invitation: @invitation},status: 200
  			else
  				render json: {error: true},status: :unprocessable_entity
  			end

  		end

      def nnnnnnn

        

      end

  	end
  end
end