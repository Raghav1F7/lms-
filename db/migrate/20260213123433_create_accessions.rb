class CreateAccessions < ActiveRecord::Migration[7.0]
  def change
    create_table :accessions do |t|
      t.string :accession_number, null: false
      t.references :book, null: false, foreign_key: { on_delete: :restrict }
      t.integer :status, null: false, default: 0

      t.timestamps
    end

    add_index :accessions, :accession_number, unique: true
  end
end
