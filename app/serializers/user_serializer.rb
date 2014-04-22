class UserSerializer < ActiveModel::Serializer
  
  attributes :id,:name,:email,:last_login,:confirmed,:created_at,:updated_at

end