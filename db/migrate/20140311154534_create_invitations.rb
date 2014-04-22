class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :user_id
      t.integer :event_id
      t.string :accepted,default: :false
      t.integer :invitee_id

      t.timestamps
    end
  end
end