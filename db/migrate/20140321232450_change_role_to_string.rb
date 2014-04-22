class ChangeRoleToString < ActiveRecord::Migration
  def change
  	change_column :invitations,:role,:string
  end
end