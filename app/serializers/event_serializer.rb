class EventSerializer < ActiveModel::Serializer
  
  attributes :id,:user_id,:title,:description,:description_html,:location,:start_date,:end_date,:created_at,:updated_at

end