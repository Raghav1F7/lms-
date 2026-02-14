class Accession < ApplicationRecord
  belongs_to :book

  enum :status, { available: 0 }, default: :available

  validates :accession_number, presence: true, uniqueness: { case_sensitive: false }

  before_validation :normalize_accession

  # Ensure immutability for critical fields
  attr_readonly :accession_number, :book_id

  private

  def normalize_accession
    self.accession_number = accession_number.strip if accession_number.present?
  end
end
