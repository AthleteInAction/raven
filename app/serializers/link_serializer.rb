class LinkSerializer < ActiveModel::Serializer

	attributes :id,:user_id,:email,:username,:created_at,:updated_at

end