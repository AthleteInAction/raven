class ContactSerializer < ActiveModel::Serializer

  attributes :id,:user_id,:contact_id,:created_at,:updated_at

end