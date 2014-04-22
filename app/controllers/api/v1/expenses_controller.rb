module Api
  module V1
  	class ExpensesController < ApplicationController

  		def index

  			@expenses = Expense.where(event_id: params[:event_id])

  			render json: @expenses

  		end
  		
  	end
  end
end