require 'rails_helper'

RSpec.describe Accession, type: :model do
  let(:book) { Book.create!(title: "T", author: "A", isbn: "I") }

  describe "validations" do
    it "is valid with accession_number and book" do
      accession = Accession.new(accession_number: "LIB-001", book: book)
      expect(accession).to be_valid
    end

    it "is invalid without accession_number" do
      accession = Accession.new(accession_number: nil)
      accession.valid?
      expect(accession.errors[:accession_number]).to include("can't be blank")
    end

    it "enforces unique accession_number" do
      Accession.create!(accession_number: "ACC1", book: book)
      duplicate = Accession.new(accession_number: "ACC1", book: book)
      expect(duplicate).not_to be_valid
    end
  end

  describe "immutability" do
    it "does not allow updating accession_number" do
      accession = Accession.create!(accession_number: "ACC1", book: book)
      expect {
        accession.update(accession_number: "ACC2")
      }.to raise_error(ActiveRecord::ReadonlyAttributeError)
    end
  end
end
