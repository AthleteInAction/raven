class AddLastLoggedIn < ActiveRecord::Migration
  def change
  	add_column :users,:last_login,:datetime,default: Time.now
  end
end