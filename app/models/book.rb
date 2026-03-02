class Book < ApplicationRecord
  has_many :accessions, dependent: :restrict_with_error

  validates :title, presence: true
  validates :author, presence: true
  validates :isbn, presence: true, uniqueness: { case_sensitive: false }

  attr_readonly :isbn

  before_validation :normalize_isbn

  def total_copies
    accessions.count
  end

  private

  def normalize_isbn
    self.isbn = isbn.strip if isbn.present?
  end
end
