class AddInstagramStuff < ActiveRecord::Migration
  def change
  	add_column :users,:instagram_id,:integer
  	add_column :users,:instagram_verified,:boolean,default: false
  end
end