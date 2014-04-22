module Api
  module V1
  	class LinksController < ApplicationController

  		def index

  			query = "SELECT l.id AS id,u.id AS user_id,u.email AS email,u.username AS username,u.created_at AS created_at,u.updated_at AS updated_at FROM links l
JOIN users u ON u.id = l.link_id
WHERE l.user_id = #{current_user.id}"
			
			if params[:email]
				query << " AND u.email LIKE '#{params[:email]}%'"
			end

  			@links = Link.find_by_sql(query)

  			render json: @links

  		end

  	end
  end
end