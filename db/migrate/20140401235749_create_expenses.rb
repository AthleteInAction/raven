class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.integer :event_id
      t.integer :price
      t.string :frequency

      t.timestamps
    end
  end
end
