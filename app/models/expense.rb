class ExpenseValidator < ActiveModel::Validator
  
  def validate expense

  	expense.price = expense.price*100 if expense.price

  end

end
class Expense < ActiveRecord::Base

	belongs_to :events

	attr_accessible :id,:event_id,:price,:frequency,:description
	validates_presence_of :price
	validates_with ExpenseValidator

end