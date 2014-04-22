class Link < ActiveRecord::Base

	belongs_to :users
	attr_accessible :user_id,:link_id,:active,:created_at,:updated_at

end