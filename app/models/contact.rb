class Contact < ActiveRecord::Base

	attr_accessible :user_id,:contact_id
	validates_uniqueness_of :contact_id, :scope => [:user_id]

end