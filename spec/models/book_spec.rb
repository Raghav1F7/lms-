require 'rails_helper'

RSpec.describe Book, type: :model do
  describe "validations" do
    it "is valid with title, author, and isbn" do
      book = Book.new(title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884")
      expect(book).to be_valid
    end

    it "is invalid without title" do
      book = Book.new(title: nil)
      book.valid?
      expect(book.errors[:title]).to include("can't be blank")
    end

    it "enforces unique isbn" do
      Book.create!(title: "Book 1", author: "Author 1", isbn: "123")
      duplicate = Book.new(title: "Book 2", author: "Author 2", isbn: "123")
      expect(duplicate).not_to be_valid
    end
  end

  describe "normalization" do
    it "strips whitespace from isbn" do
      book = Book.new(isbn: "  9780132350884  ")
      book.valid?
      expect(book.isbn).to eq("9780132350884")
    end
  end

  describe "associations" do
    it "has many accessions" do
      book = Book.reflect_on_association(:accessions)
      expect(book.macro).to eq(:has_many)
    end

    it "cannot be deleted if accessions exist" do
      book = Book.create!(title: "T", author: "A", isbn: "I")
      book.accessions.create!(accession_number: "ACC1")
      
      expect { book.destroy }.not_to change(Book, :count)
      expect(book.errors[:base]).to include("Cannot delete record because dependent accessions exist")
    end
  end
end
