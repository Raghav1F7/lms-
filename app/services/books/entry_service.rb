module Books
  class EntryService
    def self.call(params)
      new(params).call
    end

    def initialize(params)
      @params = params
      @isbn = params[:isbn]&.strip
    end

    def call
      result = { success: false, errors: nil }
      
      ApplicationRecord.transaction do
        book = find_or_initialize_book
        is_new_record = book.new_record?

        if is_new_record
          book.assign_attributes(book_params)
        end

        if book.save
          accession = book.accessions.build(accession_params)
          
          if accession.save
            result = { 
              success: true, 
              status: is_new_record ? :created : :appended,
              book: book, 
              accession: accession 
            }
          else
            result = { success: false, errors: accession.errors }
            raise ActiveRecord::Rollback
          end
        else
          result = { success: false, errors: book.errors }
          raise ActiveRecord::Rollback
        end
      end

      result
    rescue StandardError => e
      { success: false, message: e.message }
    end

    private

    def find_or_initialize_book
      Book.find_or_initialize_by(isbn: @isbn)
    end

    def book_params
      @params.slice(:title, :author, :isbn)
    end

    def accession_params
      @params.slice(:accession_number)
    end
  end
end
