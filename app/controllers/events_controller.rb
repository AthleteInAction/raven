class EventsController < ApplicationController

	before_filter :authorize#, only: [:edit, :update]

	def index

	  @events = Event.all
	  
	  respond_to do |format|
	    format.html
	    format.json {render json: @events}
	  end

	end

	def new
	  
	  @event = Event.new
	  
	  respond_to do |format|
	    format.html
	  end

	end

	def create
	  
	  params[:event][:user_id] = current_user.id
	  @event = Event.new params[:event]

	  if @event.save
	  	redirect_to root_url
	  else

	  end

	end

	def show

		@event = Event.find params[:id]
		respond_to do |format|
		  format.html
		  format.json {render json: @event}
		end

	end

end