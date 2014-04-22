class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.text :location
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end