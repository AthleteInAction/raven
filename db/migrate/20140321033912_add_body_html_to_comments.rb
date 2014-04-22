class AddBodyHtmlToComments < ActiveRecord::Migration
  def change
  	add_column :comments,:body_html,:text
  end
end