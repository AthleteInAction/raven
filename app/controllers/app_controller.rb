class AppController < ApplicationController

	before_filter :authorize#, only: [:edit, :update]
	
	def index

		#@events = Event.where user_id: current_user.id 
		@events = Event.joins("LEFT JOIN invitations on events.id = invitations.event_id WHERE invitations.invitee_id = #{current_user.id} OR events.user_id = #{current_user.id}")
		@event = Event.new
		@links = User.joins("LEFT JOIN invitations ON invitations.user_id = users.id or invitations.invitee_id = users.id WHERE users.id != #{current_user.id} AND invitations.itype = 'link' AND invitations.accepted = 'true' AND (invitations.user_id = #{current_user.id} OR invitations.invitee_id = #{current_user.id})")

	end
	
end