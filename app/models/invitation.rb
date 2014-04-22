class Invitation < ActiveRecord::Base
	belongs_to :events
	attr_accessible :user_id,:event_id,:invitee_id,:accepted,:itype,:role,:start_location
	validates_presence_of :user_id,:event_id,:invitee_id
	validates_uniqueness_of :user_id, :scope => [:invitee_id,:event_id]
end