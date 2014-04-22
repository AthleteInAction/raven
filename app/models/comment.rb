class CommentValidator < ActiveModel::Validator
  
  def validate comment

  	comment.body_html = comment.body.to_s.gsub(/\n/,'</br>')

  end

end
class Comment < ActiveRecord::Base

	belongs_to :events
	attr_accessible :event_id,:user_id,:body,:body_html,:created_at
	validates_with CommentValidator

end