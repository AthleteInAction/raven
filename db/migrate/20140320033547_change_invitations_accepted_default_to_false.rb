class ChangeInvitationsAcceptedDefaultToFalse < ActiveRecord::Migration
  def change
  	change_column_default :invitations,:accepted,false
  end
end