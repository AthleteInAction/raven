class AddTypeToInvitations < ActiveRecord::Migration
  def change
  	add_column :invitations,:itype,:string
  end
end