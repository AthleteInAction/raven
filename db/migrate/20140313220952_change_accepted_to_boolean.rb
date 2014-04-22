class ChangeAcceptedToBoolean < ActiveRecord::Migration
  def change
  	change_column :invitations, :accepted, :boolean, default: true
  end
end