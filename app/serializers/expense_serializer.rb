class ExpenseSerializer < ActiveModel::Serializer
  
  attributes :id,:event_id,:price,:frequency,:description

  def price

  	(object.price.to_f/100).to_f

  end

end