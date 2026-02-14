require 'rails_helper'

RSpec.describe Books::EntryService do
  let(:valid_params) do
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      accession_number: "LIB-101"
    }
  end

  describe ".call" do
    context "when ISBN does not exist" do
      it "creates a new book and accession" do
        expect {
          result = described_class.call(valid_params)
          expect(result[:success]).to be true
          expect(result[:status]).to eq(:created)
        }.to change(Book, :count).by(1).and change(Accession, :count).by(1)
      end
    end

    context "when ISBN already exists" do
      before do
        Book.create!(title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884")
      end

      it "appends an accession to the existing book" do
        expect {
          result = described_class.call(valid_params.merge(accession_number: "LIB-102"))
          expect(result[:success]).to be true
          expect(result[:status]).to eq(:appended)
        }.to change(Book, :count).by(0).and change(Accession, :count).by(1)
      end

      it "ignores incoming title/author differences (ISBN is authoritative)" do
        result = described_class.call(valid_params.merge(title: "Wrong Title", accession_number: "LIB-103"))
        expect(result[:book].title).to eq("Clean Code")
      end
    end

    context "with invalid data" do
      it "returns failure if accession number is taken" do
        described_class.call(valid_params)
        result = described_class.call(valid_params.merge(isbn: "DIFFERENT"))
        expect(result[:success]).to be false
        expect(result[:errors][:accession_number]).to include("has already been taken")
      end

      it "rolls back if accession fails" do
        expect {
          described_class.call(valid_params.merge(accession_number: nil))
        }.not_to change(Book, :count)
      end
    end
  end
end
