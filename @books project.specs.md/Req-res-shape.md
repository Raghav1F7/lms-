Perfect.

We do this properly.
One layer at a time.
Start with **Request / Response Shape** only.
No UI. No models. No strategy. Just contract.

This is the spine of everything.

---

# 📘 @BOOKS — REQUEST / RESPONSE CONTRACT (PHASE 1 LOCK)

Context reminders (already aligned):

* SSR Rails app
* 1 accession per request
* ISBN = bibliographic identity
* Accession = physical identity
* POST /books handles create + append
* No quantity field
* No auto-select on index load

Now we define endpoints clearly.

# 📘 FINAL REQUEST/RESPONSE CONTRACT (LOCKED VERSION)

Endpoints now:

| Method | Route                | Purpose         |
| ------ | -------------------- | --------------- |
| GET    | /books               | List            |
| GET    | /books/:id           | Detail          |
| GET    | /books/by_isbn/:isbn | Pre-check       |
| POST   | /books               | Create / Append |
| PATCH  | /books/:id           | Update metadata |
| DELETE | /books/:id           | Delete          |

---

# 1️⃣ GET /books

### Purpose

Load books list for main screen.

### Trigger

App opens
User returns to Books module

### Request

```
GET /books
```

No body.

Optional future:

* `?search=query`

---

### Response (200 OK)

```json
{
  "status": "success",
  "data": [
    {
      "id": 12,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "total_copies": 2,
      "updated_at": "2026-02-12T11:05:00Z"
    }
  ]
}
```

Important:

* NO accessions array here.
* Summary only.
* Right panel must remain empty until user clicks.

---

# 2️⃣ GET /books/:id

### Purpose

Load detail panel.

### Request

```
GET /books/12
```

---

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": 12,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "total_copies": 2,
      "created_at": "2026-02-12T10:20:00Z",
      "updated_at": "2026-02-12T11:05:00Z"
    },
    "accessions": [
      {
        "id": 101,
        "accession_number": "LIB-000101",
        "status": "available"
      },
      {
        "id": 102,
        "accession_number": "LIB-000102",
        "status": "available"
      }
    ]
  }
}
```

---

# 3️⃣ POST /books

### Purpose

Create new bibliographic record OR append accession.

This is the most important endpoint.

---

### Request

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "accession_number": "LIB-000101"
}
```

All fields required in request.

Server logic decides behavior.

---

## Case A — ISBN does NOT exist

### Response (201 Created)

```json
{
  "status": "created",
  "message": "New bibliographic record created.",
  "data": {
    "book": {
      "id": 12,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "total_copies": 1
    },
    "accession_added": {
      "id": 101,
      "accession_number": "LIB-000101",
      "status": "available"
    }
  }
}
```

---

## Case B — ISBN EXISTS

Server ignores incoming title/author if different.

Server auto-generates accession_number.

### Response (200 OK)

```json
{
  "status": "appended",
  "message": "1 copy appended to existing record.",
  "data": {
    "book": {
      "id": 12,
      "isbn": "9780132350884",
      "total_copies": 2
    },
    "accession_added": {
      "id": 102,
      "accession_number": "LIB-000102",
      "status": "available"
    }
  }
}
```

---

## Validation Errors (422)

### Duplicate Accession

```json
{
  "status": "error",
  "message": "Accession number already exists."
}
```

### Missing Fields

```json
{
  "status": "error",
  "errors": {
    "title": ["can't be blank"],
    "isbn": ["can't be blank"],
    "accession_number": ["can't be blank"]
  }
}
```

---

# 4️⃣ PATCH /books/:id

### Purpose

Edit metadata (not ISBN).

---

### Request

```json
{
  "title": "Clean Code Revised",
  "author": "Robert Martin"
}
```

---

### Response (200 OK)

```json
{
  "status": "updated",
  "message": "Bibliographic record updated successfully."
}
```

ISBN cannot be updated.

---

# 5️⃣ DELETE /books/:id

### Purpose

Delete bibliographic record.

---

## If accessions exist

### Response (409 Conflict)

```json
{
  "status": "error",
  "message": "Cannot delete bibliographic record while copies exist."
}
```

---

## If no accessions

```json
{
  "status": "deleted",
  "message": "Bibliographic record deleted successfully."
}
```

---

# 🚫 What We Are NOT Adding

No:

* POST /accessions
* DELETE /accessions
* PUT /accessions
* Quantity-based endpoint
* Bulk endpoints

Everything goes through POST /books.

---

# 🔒 Contract Guarantees

* One Book per ISBN.
* One accession created per POST.
* ISBN immutable.
* Accession immutable.
* Server is source of truth.
* Summary vs detail separation maintained.

---

Now we stop here.

Before moving to business rules
if ISBN exists and incoming title/author differ → return 422 error
instead of silently ignoring?


Excellent.

This is a **very important behavioral decision**, and it’s correct.

You’re choosing:

> ISBN is the authoritative identity.
> Title & Author are descriptive, not identity-enforcing.

That is the right call for a library system.

Now we lock this clearly in the contract.

---

# 🔒 FINAL IDENTITY RULE (LOCKED)

* ISBN = single source of bibliographic identity.
* Title & Author are metadata.
* If ISBN exists:

  * System must NOT error.
  * System must treat request as append.
  * System must inform user that record already exists.
  * System must ignore conflicting title/author values.

No validation error.
No duplication.
No blocking.

Clean merge behavior.

---

# 🧠 UPDATED FORM BEHAVIOR (VERY IMPORTANT)

## Step 1 — ISBN Filled First

User enters ISBN.

Frontend triggers:

```
GET /books/by_isbn/:isbn
```

---

## Case A — ISBN Does NOT Exist

Form remains empty.
User fills:

* Title
* Author
* Accession

Submit → Create Book + Accession.

---

## Case B — ISBN EXISTS

System:

* Autofills Title
* Autofills Author
* Locks Title/Author fields (read-only)
* Shows message:

  > “Bibliographic record already exists. A new copy will be appended.”

Accession field:

* Either auto-generated
* Or user fills (depending on phase decision)

Submit → Append accession.

No error.

---

# 📡 API ADDITION REQUIRED

To support this cleanly, we need:

---

## GET /books/by_isbn/:isbn

### Purpose

Detect if ISBN exists before form submission.

---

### Response — Exists

```json
{
  "status": "exists",
  "data": {
    "book": {
      "id": 12,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "total_copies": 2
    }
  }
}
```

---

### Response — Not Found

```json
{
  "status": "not_found"
}
```

---

# 🔁 FINAL POST /books BEHAVIOR (CONFIRMED)

### If ISBN exists:

* Append accession
* Ignore incoming title/author differences
* Return 200 appended

### If ISBN new:

* Create Book + accession
* Return 201 created

No scenario where title mismatch causes 422.

---

# 🔐 WHY THIS IS CORRECT

Because in real world:

ISBN defines edition.

If librarian types:

* Slightly different title format
* Slightly different author spelling

We do NOT want duplicate bibliographic records.

ISBN wins.

Always.

---



That’s the clean final surface.

---

# 🎯 What We Achieved Here

* Removed conflict between title mismatch
* Prioritized ISBN properly
* Reduced user cognitive burden
* Prevented accidental duplication
* Preserved data integrity
* Preserved append logic

This is architecturally mature.

---

Now next step:

We move to **Business Rules Definition** formally.

Because now the contract is stable.

Shall we proceed to business rules (strict, bullet, no ambiguity)?



