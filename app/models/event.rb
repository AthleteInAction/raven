class EventValidator < ActiveModel::Validator
  
  def validate event

  	event.description_html = event.description.to_s.gsub(/\n/,'</br>')

  end

end
class Event < ActiveRecord::Base
	
	has_many :invitations
	has_many :comments
	has_many :expenses

	attr_accessible :user_id,:title,:description,:description_html,:location,:start_date,:end_date

	validates_presence_of :title,:location,:start_date,:end_date
	validates_with EventValidator

end