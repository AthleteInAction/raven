class CommentValidator < ActiveModel::Validator
  
  def validate comment

  	comment.body_html = comment.body

  	#regexps
  	http = /( |^)http:\/\/([^\s]*\.[^\s]*)( |$)/
  	https = /( |^)https:\/\/([^\s]*\.[^\s]*)( |$)/
  	twitter = /@(\w+)/

  	while comment.body_html =~ http
  	    name = $2
  	    comment.body_html.sub! /( |^)http:\/\/#{name}( |$)/, " <a href=\"http://#{name}\" target=\"_blank\" class=\"comment-link\">http://#{name}</a> "
  	end
  	while comment.body_html =~ https
  	    name = $2
  	    comment.body_html.sub! /( |^)https:\/\/#{name}( |$)/, " <a href=\"https://#{name}\" target=\"_blank\" class=\"comment-link\">https://#{name}</a> "
  	end
  	while comment.body_html =~ twitter
  		name = $2
  		comment.body_html.sub! "@#{$1}", "<a href=\"http://twitter.com/#{$1}\" target=\"_blank\" class=\"comment-link\">&#64;#{$1}</a>"
  	end

  	comment.body_html = comment.body_html.to_s.gsub(/\n/,'</br>')

  end

end
class Comment < ActiveRecord::Base

	belongs_to :events
	attr_accessible :event_id,:user_id,:body,:body_html,:created_at
	validates_with CommentValidator

end