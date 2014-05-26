class EventValidator < ActiveModel::Validator
  
  def validate event

  	event.description_html = event.description

  	#regexps
  	http = /( |^)http:\/\/([^\s]*\.[^\s]*)( |$)/
  	https = /( |^)https:\/\/([^\s]*\.[^\s]*)( |$)/
  	twitter = /@(\w+)/

  	while event.description_html =~ http
  	    name = $2
  	    event.description_html.sub! /( |^)http:\/\/#{name}( |$)/, " <a href=\"http://#{name}\" target=\"_blank\" class=\"comment-link\">http://#{name}</a> "
  	end
  	while event.description_html =~ https
  	    name = $2
  	    event.description_html.sub! /( |^)https:\/\/#{name}( |$)/, " <a href=\"https://#{name}\" target=\"_blank\" class=\"comment-link\">https://#{name}</a> "
  	end
  	while event.description_html =~ twitter
  		name = $2
  		event.description_html.sub! "@#{$1}", "<a href=\"http://twitter.com/#{$1}\" target=\"_blank\" class=\"comment-link\">&#64;#{$1}</a>"
  	end
  	
  	event.description_html = event.description_html.to_s.gsub(/\n/,'</br>')

  end

end
class Event < ActiveRecord::Base
	
	has_many :invitations
	has_many :comments
	has_many :expenses

	attr_accessible :user_id,:title,:description,:description_html,:location,:hashtag,:start_date,:end_date

	validates_presence_of :title,:location,:start_date,:end_date
	validates_with EventValidator

end