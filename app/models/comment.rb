class CommentValidator < ActiveModel::Validator
  
  def validate comment

  	comment.body_html = comment.body.to_s.gsub(/\n/,'</br>')

  	comment.body_html.to_s.scan(/(http?:\/\/[\S]+|https?:\/\/[\S]+)/).each do |b|


  		#comment.body_html = comment.body_html.gsub(b[0].to_s,"<a href=\"#{b[0]}\" target=\"_blank\" class=\"comment-link\">#{b[0]}</a>")

  	end

  end

end
class Comment < ActiveRecord::Base

	belongs_to :events
	attr_accessible :event_id,:user_id,:body,:body_html,:created_at
	validates_with CommentValidator

end