module Api
  module V1
  	class EventsController < ApplicationController

  		respond_to :json

      # Index
      # ====================================================================================
      # ====================================================================================
  		def index

        @query = "SELECT i.*,e.* FROM invitations i JOIN events e ON e.id = i.event_id WHERE i.invitee_id = #{current_user.id}"
        @query << " AND i.accepted = #{params[:accepted]}" if params[:accepted]
        @query << " AND (MONTH(e.start_date) = #{params[:month]} OR MONTH(e.end_date) = #{params[:month]})" if params[:month]
        @query << " AND (YEAR(e.start_date) = #{params[:year]} OR YEAR(e.end_date) = #{params[:year]})" if params[:year]
        @query << " AND (e.start_date >= DATE('#{params[:from]}') OR e.end_date >= DATE('#{params[:from]}'))" if params[:from]
        if params[:orderby]
          @query << " ORDER BY e.#{params[:orderby].to_s.downcase}"
          if params[:order]
            @query << " #{params[:order].to_s.upcase}"
          else
            @query << " DESC"
          end
        else
          @query << " ORDER BY e.id DESC"
        end

        @events = Event.find_by_sql @query

  			render json: @events

  		end
      # ====================================================================================
      # ====================================================================================



      # Create
      # ====================================================================================
      # ====================================================================================
  		def create

  			params[:event][:user_id] = current_user.id

        @event = Event.new params[:event]

        # Save Event
        # ////////////////////////////////////////////////////////
        # ////////////////////////////////////////////////////////
        if @event.save

          # Save invitations
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          Invitation.new(user_id: current_user.id,invitee_id: current_user.id,event_id: @event.id,itype: 'event',role: 'creator',accepted: true).save
          params[:event][:invitees] || params[:event][:invitees] = []        
          params[:event][:invitees].each do |invitation|

            @invitee = User.find_by_email(invitation[:email])
            if @invitee
              Invitation.new(user_id: current_user.id,invitee_id: invitation[:id],event_id: @event.id,itype: 'event',role: 'invitee',accepted: false).save
              Contact.new(user_id: current_user.id,contact_id: @invitee.id).save
            else
              user = User.new(email: invitation[:email],password: 'xxx')
              if user.save
                Invitation.new(user_id: current_user.id,invitee_id: user.id,event_id: @event.id,itype: 'event',role: 'invitee',accepted: false).save
                Contact.new(user_id: current_user.id,contact_id: user.id).save
              end
            end

          end
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

          # Save expenses
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          params[:event][:expenses] || params[:event][:expenses] = []
          params[:event][:expenses].each do |expense|

            Expense.new(event_id: @event.id,price: expense[:price],frequency: expense[:frequency],description: expense[:description]).save if expense[:price]

          end
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          # ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

          render json: @event

        else

          render json: @event.errors

        end
        # ////////////////////////////////////////////////////////
        # ////////////////////////////////////////////////////////

  		end
      # ====================================================================================
      # ====================================================================================



      # Show
      # ====================================================================================
      # ====================================================================================
  		def show

  			@event = Event.find params[:id]
        
  			render json: @event

  		end
      # ====================================================================================
      # ====================================================================================



      # Update
      # ====================================================================================
      # ====================================================================================
      def update

        @event = Event.find params[:id]

        if @event.update_attributes(params[:event])

          render json: @event

        else

          render json: @event.errors,status: :unprocessable_entity

        end

      end
      # ====================================================================================
      # ====================================================================================



      # Users
      # ====================================================================================
      # ====================================================================================
      def users

        @users = User.find_by_sql("SELECT i.*,u.* FROM invitations i JOIN users u ON u.id = i.invitee_id WHERE i.event_id = #{params[:event_id]}")

        render json: @users,root: :users 

      end
      # ====================================================================================
      # ====================================================================================

  	end
  end
end