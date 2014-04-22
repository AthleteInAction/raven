class AddStartLocationToInvitations < ActiveRecord::Migration
  def change
  	add_column :invitations,:start_location,:string
  end
end