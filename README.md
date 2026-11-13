# Library Inventory System

A Rails application for maintaining a library's bibliographic records and tracking the physical copies held in its collection.

The system separates a book's bibliographic identity from each physical copy: an ISBN identifies an edition, while an accession number identifies an individual item.

## What it does

- **Book cataloguing:** create and browse book records using title, author and ISBN.
- **Physical-copy tracking:** attach individual accession records to a book.
- **Create-or-append workflow:** submitting an ISBN creates a bibliographic record when it is new, or adds another accession to the existing record when the ISBN is already present.
- **Integrity-focused data model:** ISBNs and accession numbers are unique; accession identity fields are read-only after creation.
- **Transactional writes:** book and accession creation are handled together so a failed accession does not leave a newly created book behind.
- **Responsive book workspace:** the current interface uses Turbo Frames to update the book list and detail panels.

## Domain model

    Book (one bibliographic edition, identified by ISBN)
      └── has many Accessions (individual physical copies)

- A Book has a unique ISBN and required title and author.
- An Accession belongs to one book and has a unique accession number.
- The current accession status is available.
- Total copies are derived from the associated accession records rather than stored as a separate counter.
- Deleting a book with associated accessions is restricted.

These are the rules represented by the current models, service and database schema. This repository does not currently describe a circulation/loan workflow.

## Technology

- Ruby 3.4.7
- Ruby on Rails 8.1
- PostgreSQL
- Hotwire (Turbo)
- Tailwind CSS
- RSpec

## Run locally

### Prerequisites

- Ruby 3.4.7
- PostgreSQL
- Bundler

### Setup

    bundle install
    bin/rails db:prepare
    bin/rails server

The application uses the lms_development PostgreSQL database by default. Configure your local PostgreSQL role or adjust the database settings in config/database.yml as needed.

Open http://localhost:3000.

### Tests

    bundle exec rspec

## Project structure

- app/models — book and accession domain models
- app/services/books/entry_service.rb — transactional create-or-append workflow
- app/controllers/books_controller.rb — book endpoints and request handling
- app/views/books — book list, detail and form views
- db — migrations and schema

## Current scope

This repository focuses on bibliographic records and physical-copy inventory. Features such as member management, lending, returns, fines and reporting are not documented as implemented here.

## License

No license is currently specified in this repository. Contact the repository owner before reusing the code.
