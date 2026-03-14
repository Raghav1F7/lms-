<div align="center">

# 📚 @BOOKS

### A precision-first Library Management System built on Ruby on Rails 8

[![CI](https://github.com/Raghav1F7/lms-/actions/workflows/ci.yml/badge.svg)](https://github.com/Raghav1F7/lms-/actions/workflows/ci.yml)
[![Ruby](https://img.shields.io/badge/Ruby-3.4.7-CC342D?logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.1.1-CC0000?logo=rubyonrails&logoColor=white)](https://rubyonrails.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> *"A librarian should say: 'This system will not let me make mistakes.' That is the bar."*

</div>

---

## Overview

**@BOOKS** is a robust, domain-driven library management system designed around a single guiding principle: **data integrity over everything**. It manages bibliographic records (books) and their physical copies (accessions) through a set of strictly enforced business rules that make invalid states impossible to represent.

Rather than optimising for feature quantity, @BOOKS prioritises **correctness, trust, and clarity** — making it an ideal foundation for real-world library cataloguing workflows.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Bibliographic Registry** | Create and manage books identified uniquely by ISBN |
| **Accession Tracking** | Track individual physical copies with immutable accession numbers |
| **Smart Entry Service** | A single endpoint intelligently creates or appends — no duplicate books |
| **Atomic Transactions** | Book + accession creation is always all-or-nothing |
| **Referential Integrity** | Books with copies cannot be deleted — the data never lies |
| **ISBN Lookup** | Pre-flight ISBN check to determine create vs. append intent |
| **Normalised Inputs** | ISBN and accession numbers are trimmed and normalised automatically |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          HTTP Layer                             │
│                       BooksController                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
│                  Books::EntryService                            │
│  • Determines :created vs :appended intent                      │
│  • Wraps the entire operation in a DB transaction               │
└──────────────┬────────────────────────────┬─────────────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────────┐  ┌─────────────────────────────────┐
│       Book (Model)       │  │       Accession (Model)         │
│  isbn     (unique)       │  │  accession_number (unique)      │
│  title    (required)     │  │  status           (enum)        │
│  author   (required)     │  │  book_id          (FK)          │
└──────────────────────────┘  └─────────────────────────────────┘
               │ has_many (restrict_with_error)
               └──────────────────────────────▶ Accession
```

**Design decisions:**
- ISBN is the sole bibliographic identity — one book per ISBN, forever
- Accession number is the sole physical identity — globally unique and immutable (`attr_readonly`)
- Transactions guarantee that a book record is never created without at least one accession

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Ruby 3.4.7 |
| **Framework** | Rails 8.1.1 |
| **Database** | PostgreSQL |
| **Frontend** | Tailwind CSS · Turbo Rails · Stimulus JS |
| **Asset Pipeline** | Propshaft · Importmap |
| **Web Server** | Puma + Thruster |
| **Background Jobs** | Solid Queue |
| **Caching** | Solid Cache |
| **WebSockets** | Solid Cable |
| **Deployment** | Kamal (Docker) |
| **Testing** | RSpec · Capybara · Selenium WebDriver |
| **Security** | Brakeman · Bundler Audit · Importmap Audit |
| **Linting** | RuboCop (Omakase) |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Ruby** `3.4.7` — via [rbenv](https://github.com/rbenv/rbenv) or [asdf](https://asdf-vm.com/)
- **PostgreSQL** `16+`
- **Bundler** `2.x`
- **Node.js** *(only required for asset builds if not using importmap)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Raghav1F7/lms-.git
cd lms-

# 2. Install Ruby dependencies
bundle install

# 3. Set up credentials (copy your master.key or generate new credentials)
#    Skip if you have the config/master.key file already
EDITOR="code --wait" bin/rails credentials:edit

# 4. Create and migrate the databases
bin/rails db:create db:migrate

# 5. (Optional) Seed sample data
bin/rails db:seed
```

### Running the Development Server

```bash
# Start both Rails and Tailwind CSS watcher (recommended)
bin/dev

# Or start Rails only
bin/rails server
```

The application will be available at **http://localhost:3000**.

---

## 🧪 Running Tests

@BOOKS uses **RSpec** as the test framework with **Capybara** for system-level browser testing.

```bash
# Run the full test suite
bundle exec rspec

# Run a specific spec file
bundle exec rspec spec/services/books/entry_service_spec.rb

# Run model specs only
bundle exec rspec spec/models/

# Run with documentation format
bundle exec rspec --format documentation
```

### Code Quality & Security

```bash
# Lint with RuboCop
bin/rubocop

# Scan for Rails security vulnerabilities
bin/brakeman --no-pager

# Audit gem vulnerabilities
bin/bundler-audit

# Audit JavaScript importmap dependencies
bin/importmap audit
```

All of the above are enforced automatically in CI on every push and pull request.

---

## 🗂️ API Reference

All routes are scoped under `/books`.

| Method | Path | Controller#Action | Description |
|---|---|---|---|
| `GET` | `/books` | `books#index` | List all books with copy counts |
| `POST` | `/books` | `books#create` | Create a book + accession (atomic) |
| `GET` | `/books/:id` | `books#show` | Show book details and accessions |
| `PATCH/PUT` | `/books/:id` | `books#update` | Update book metadata |
| `DELETE` | `/books/:id` | `books#destroy` | Delete book (only if no accessions) |
| `GET` | `/books/by_isbn` | `books#by_isbn` | Look up a book by ISBN |

### Smart Entry Behaviour (POST /books)

The create endpoint is idempotent with respect to ISBN:

```
POST /books  { isbn: "978-3-16-148410-0", title: "...", author: "...", accession_number: "A-001" }

→ ISBN not found  → creates Book + Accession   (status: :created)
→ ISBN found      → appends new Accession only  (status: :appended)
```

---

## 📁 Project Structure

```
lms-/
├── app/
│   ├── controllers/
│   │   └── books_controller.rb       # HTTP layer
│   ├── models/
│   │   ├── book.rb                   # Bibliographic identity (ISBN)
│   │   └── accession.rb              # Physical copy identity
│   ├── services/
│   │   └── books/
│   │       └── entry_service.rb      # Create/append business logic
│   └── views/
│       └── books/                    # ERB templates
├── config/
│   ├── routes.rb                     # Route definitions
│   └── database.yml                  # PostgreSQL configuration
├── db/
│   ├── migrate/                      # Database migrations
│   └── schema.rb                     # Current schema snapshot
├── spec/
│   ├── models/                       # Model unit tests
│   ├── services/                     # Service unit tests
│   └── requests/                     # Integration tests
└── Dockerfile                        # Production container build
```

---

## 🐳 Deployment

@BOOKS is fully containerised and deploys via **Kamal** (Docker orchestration).

```bash
# Configure your deploy target in config/deploy.yml
# Then deploy to production
bin/kamal deploy
```

**Docker (manual):**

```bash
# Build the production image
docker build -t books-lms .

# Run the container (requires DATABASE_URL and RAILS_MASTER_KEY)
docker run -p 80:80 \
  -e DATABASE_URL="postgres://..." \
  -e RAILS_MASTER_KEY="..." \
  books-lms
```

The production image:
- Uses a multi-stage build for minimal image size
- Runs as a non-root `rails` user (UID 1000)
- Exposes port **80** via Thruster (HTTP asset caching + compression)

---

## 🔐 Security

Security is a first-class concern in @BOOKS:

- **Brakeman** scans for common Rails vulnerabilities on every CI run
- **Bundler Audit** checks gems against the Ruby Advisory Database
- **Importmap Audit** checks JavaScript dependencies
- Secrets are managed via Rails encrypted credentials (`config/credentials.yml.enc`)
- The production container runs as a non-root user

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Ensure all checks pass: `bundle exec rspec && bin/rubocop && bin/brakeman --no-pager`
5. Open a Pull Request

Please follow the existing code style (RuboCop Omakase rules) and ensure new behaviour is covered by specs.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using Ruby on Rails 8 · PostgreSQL · Tailwind CSS</sub>
</div>
