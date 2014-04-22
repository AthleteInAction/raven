module Api
  module V1
  	class ContactsController < ApplicationController

  		def index

  			@contacts = User.find_by_sql("SELECT u.* FROM contacts c JOIN users u ON u.id = c.contact_id WHERE c.user_id = #{current_user.id}")
  			#@contacts = Contact.where user_id: params[:user_id]
  			render json: @contacts

  		end

  	end
  end
end