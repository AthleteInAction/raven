class ChangeInvitaionsDefault < ActiveRecord::Migration
  def change
  	change_column :invitations,:itype,:string,default: 'event'
  end
end