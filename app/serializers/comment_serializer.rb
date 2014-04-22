class CommentSerializer < ActiveModel::Serializer
  
  attributes :id,:user_id,:event_id,:body,:body_html,:created_at,:clean_date

  def body

  	object.body

  end

  def clean_date

  	object.created_at.in_time_zone('America/Los_Angeles').strftime('%-m-%-d-%Y %-l:%M:%S %p')

  end


end