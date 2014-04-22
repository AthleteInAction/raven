class InvitationSerializer < ActiveModel::Serializer
  
  attributes :id,:event_id,:user_id,:invitee_id,:accepted,:role,:start_location,:created_at,:updated_at

end