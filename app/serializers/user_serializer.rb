class UserSerializer < ActiveModel::Serializer
  
  attributes :id,:name,:email,:instagram_verified,:instagram_id,:instagram_token,:profile_pic,:last_login,:confirmed,:created_at,:updated_at

end