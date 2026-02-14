class BooksController < ApplicationController
  before_action :set_book, only: [:show, :edit, :update, :destroy]

  def index
    @books = Book.all.order(updated_at: :desc)
    @selected_book = nil
  end

  def show
    @books = Book.all.order(updated_at: :desc)
    @selected_book = @book
    @accessions = @book.accessions
  end

  def new
    @book = Book.new
  end

  def create
    result = Books::EntryService.call(book_params)
    
    if result[:success]
      @book = result[:book]
      message = result[:message] || "Book saved successfully."
      respond_to do |format|
        format.turbo_stream { flash.now[:notice] = message }
        format.html { redirect_to books_path, notice: message }
      end
    else
      @errors = result[:errors]
      @book = Book.new(book_params.slice(:title, :author, :isbn))
      render :new, status: :unprocessable_entity
    end
  end

  def by_isbn
    @book = Book.find_by(isbn: params[:isbn])
    if @book
      render json: { status: "exists", data: { book: @book } }
    else
      render json: { status: "not_found" }
    end
  end

  def destroy
    if @book.destroy
      flash[:notice] = "Book deleted successfully."
      redirect_to books_path
    else
      flash[:alert] = @book.errors.full_messages.to_sentence
      redirect_to book_path(@book)
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :author, :isbn, :accession_number)
  end
end
