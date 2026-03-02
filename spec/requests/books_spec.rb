require 'rails_helper'

RSpec.describe "Books", type: :request do
  describe "GET /books" do
    it "renders the index template" do
      get books_path
      expect(response).to have_http_status(:success)
      expect(response.body).to include("Books")
    end
  end

  describe "GET /books/:id" do
    let(:book) { Book.create!(title: "Detail Test", author: "Author", isbn: "DETAIL1") }
    
    it "renders the show template and includes detail frame" do
      get book_path(book)
      expect(response).to have_http_status(:success)
      expect(response.body).to include("Detail Test")
      expect(response.body).to include("turbo-frame id=\"detail_frame\"")
    end
  end

  describe "POST /books" do
    let(:valid_params) do
      {
        book: {
          title: "New Book",
          author: "New Author",
          isbn: "NEW-123",
          accession_number: "ACC-001"
        }
      }
    end

    context "with valid parameters" do
      it "creates a new book and redirects" do
        expect {
          post books_path, params: valid_params
        }.to change(Book, :count).by(1).and change(Accession, :count).by(1)
        
        expect(response).to redirect_to(books_path)
        follow_redirect!
        expect(response.body).to include("Book created successfully")
      end

      it "appends accession if ISBN exists and shows append message" do
        Book.create!(title: "Old Book", author: "Old Author", isbn: "NEW-123")
        
        expect {
          post books_path, params: valid_params.merge(book: { isbn: "NEW-123", accession_number: "ACC-002" })
        }.to change(Book, :count).by(0).and change(Accession, :count).by(1)

        expect(response).to redirect_to(books_path)
        follow_redirect!
        expect(response.body).to include("Accession added to existing book")
      end
    end

    context "with invalid parameters" do
      it "returns unprocessable entity" do
        post books_path, params: { book: { title: "", isbn: "" } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "GET /books/by_isbn" do
    it "returns exists status if found" do
      Book.create!(title: "Search Me", author: "A", isbn: "FIND-ME")
      get by_isbn_books_path(isbn: "FIND-ME")
      
      json = JSON.parse(response.body)
      expect(json["status"]).to eq("exists")
      expect(json["data"]["book"]["title"]).to eq("Search Me")
    end

    it "returns not_found status if missing" do
      get by_isbn_books_path(isbn: "NOSUCH")
      json = JSON.parse(response.body)
      expect(json["status"]).to eq("not_found")
    end
  end
end
