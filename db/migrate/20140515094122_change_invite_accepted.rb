class ChangeInviteAccepted < ActiveRecord::Migration
  def change
  	change_column :invitations,:accepted,:integer,default: 0
  end
end