# Validation Checklists

Use these checklists to validate every phase of development.

## 🗄️ Database Schema Best Practices
- [ ] Every table has a primary key (usually `id`).
- [ ] Every foreign key has an index.
- [ ] Every required field has a `NOT NULL` constraint.
- [ ] Every unique field has a `UNIQUE` index.
- [ ] Boolean fields have a default value (true/false, not null).
- [ ] Timestamps (`created_at`, `updated_at`) are present.

## 🧹 Code Quality Gates
- [ ] No N+1 queries.
- [ ] No business logic in controllers.
- [ ] No hardcoded configuration values/secrets.
- [ ] Methods are short and single-purpose.
- [ ] Variable names are descriptive.

## 🔒 Security Review
- [ ] Authentication is required for all non-public endpoints.
- [ ] Authorization (pundit/cancancan) is checked for every action.
- [ ] mass-assignment protection is active (strong params).
- [ ] No raw SQL injection vulnerabilities.
- [ ] Sensitive data (PII) is encrypted or masked.

## 🚀 Deployment Readiness
- [ ] **Phase Gates Passed:** All previous phases are confirmed complete.
- [ ] **Git Discipline:** Branch is up-to-date with `main` and CI is green.
- [ ] Migrations are reversible.
- [ ] Environment variables are documented.
- [ ] Rollback plan exists.
- [ ] Logs are clean and meaningful.
