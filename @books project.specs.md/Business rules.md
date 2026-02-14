Good.

Now we stop thinking like developers.

We think like system designers.

You are absolutely right:

> The intent of business rules is not functionality.
> It is trust.

A librarian should say:

> “This system will not let me make mistakes.”

That is the bar.

So business rules are about:

• Preventing inconsistency
• Preventing duplication
• Preventing silent corruption
• Making identity layers sacred
• Ensuring deterministic behavior

Now we define @books business rules formally.

No UI.
No API.
Just truth rules.

---

# 📘 @BOOKS — BUSINESS RULES (TRUST FRAMEWORK)

---

# 🔒 SECTION 1 — IDENTITY INTEGRITY RULES

## Rule 1 — ISBN Is The Sole Bibliographic Identity

* ISBN uniquely identifies a bibliographic record.
* There can never be more than one Book with the same ISBN.
* ISBN is immutable after creation.
* ISBN comparison must be normalized (trimmed, case-consistent).

Why?
Because ISBN defines edition-level identity.

If this breaks → trust breaks.

---

## Rule 2 — Accession Number Is The Sole Physical Identity

* Accession number uniquely identifies a physical copy.
* Accession number must be globally unique.
* Accession number is immutable.
* Accession number can never be reused.
* Accession number cannot be edited.

Why?
Because accession represents real physical asset tracking.

If this breaks → inventory integrity collapses.

---

# 🧱 SECTION 2 — CREATION & MERGE RULES

## Rule 3 — One Book Per ISBN

When POST /books is called:

IF ISBN does NOT exist:
→ Create new Book.

IF ISBN EXISTS:
→ Never create new Book.
→ Append accession.

There is no scenario where duplicate Book is allowed.

---

## Rule 4 — Append Logic Must Be Deterministic

If ISBN exists:

* Incoming title/author differences must NOT create conflict.
* System must treat it as append.
* System must inform user clearly.

Why?
Because ISBN outranks metadata spelling differences.

---

## Rule 5 — Exactly One Accession Per Request (Phase 1)

Each POST request must result in exactly:

* 1 accession created.

No more.
No less.

This keeps behavior predictable.

---

# 🛡 SECTION 3 — DATA CONSISTENCY RULES

## Rule 6 — A Book Cannot Exist Without At Least One Accession

When a new Book is created:

→ It must always be created with 1 accession.

There must never be an orphan Book with zero accessions.

Why?
Because this is inventory-first system.

---

## Rule 7 — A Book Cannot Be Deleted If Accessions Exist

Deletion rule:

If book has accessions:
→ Reject deletion.

Why?
Because deleting bibliographic record while physical copies exist destroys traceability.

---

## Rule 8 — Accession Cannot Exist Without Book

Accession must always reference valid Book.
Foreign key required.
No orphan accessions.

---

# 📊 SECTION 4 — STATE INTEGRITY RULES

## Rule 9 — Derived Fields Must Not Be Stored

total_copies must NOT be stored as a column.
It must always be computed from count of accessions.

Why?
Stored derived data causes mismatch risk.

Trust comes from single source of truth.

---

## Rule 10 — Server Is Authority

Client input must never be trusted blindly.

Server must validate:

* ISBN uniqueness
* Accession uniqueness
* Required fields
* Referential integrity

Frontend behavior is convenience.
Backend is authority.

---

# 🧠 SECTION 5 — USER EXPERIENCE TRUST RULES

## Rule 11 — No Silent Behavior

System must:

* Inform user when append happens.
* Inform user when new record created.
* Inform user when deletion blocked.

Never silently merge without messaging.

Trust requires transparency.

---

## Rule 12 — No Implicit Auto-Selection On Load

On initial load:

* No book auto-selected.

Why?
Because implicit behavior creates confusion.

User must intentionally choose context.

---

# 🔍 SECTION 6 — VALIDATION RULES

Required fields:

* ISBN
* Title
* Author
* Accession Number (Phase 1)

All required.

No partial creation allowed.

---

# 🧩 SECTION 7 — ERROR HANDLING RULES

Errors must be:

* Deterministic
* Clear
* Non-technical
* Domain-aligned

Example:

Not:

> “Validation failed”

Instead:

> “Accession number already exists.”

---

# 🧠 SECTION 8 — NORMALIZATION RULES

Before saving ISBN:

* Trim whitespace
* Normalize casing if needed
* Ensure no invisible mismatch

This prevents accidental duplication.

Trust depends on consistency.

---

# 🎯 WHAT THESE RULES ACHIEVE

They guarantee:

✔ No duplicate bibliographic records
✔ No duplicate physical copies
✔ No silent corruption
✔ No identity conflicts
✔ Deterministic append behavior
✔ Referential integrity
✔ Inventory traceability
✔ Predictable deletion logic

This is what makes system trustworthy.

Not UI.
Not animation.
Not speed.

Correctness.

---

# 🧠 ONE FINAL QUESTION BEFORE LOCKING

Should system:

Allow two different Books with different ISBN but same Title?

Example:

“Clean Code”

* ISBN 9780132350884
* ISBN 9780137081073 (different edition)

Correct answer in real world is:

YES — because ISBN defines edition.

But I want you to confirm explicitly.

Once we lock that,
your business rules will be enterprise-grade solid.
-----------------



