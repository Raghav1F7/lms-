# LMS

A Ruby on Rails 8 application for managing library books and accessions.

## Prerequisites

- Ruby `3.4.7` (see `.ruby-version`)
- PostgreSQL
- Bundler `2.6.x`

## Local Setup

1. Install dependencies:
   ```bash
   bundle install
   ```
2. Prepare the database:
   ```bash
   bin/rails db:prepare
   ```
3. Start the app in development:
   ```bash
   bin/dev
   ```

## Running Checks

Run the primary quality and security checks locally:

```bash
bin/brakeman --no-pager
bin/bundler-audit
bin/importmap audit
bin/rubocop -f github
```

## Docker and Supply-Chain Policy

This repository enforces container hardening rules:

- `Dockerfile` base images must be pinned by digest (`@sha256:...`).
- Build-time `ARG`/`ENV` names that resemble secrets are disallowed.
- Asset precompile uses a safe dummy value (`SECRET_KEY_BASE_DUMMY=1`) rather than real secrets.

You can validate policy locally with:

```bash
.github/scripts/dockerfile-policy-check.sh Dockerfile
```

## CI

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

- Brakeman (configured to tolerate exit code `5` when a newer Brakeman version is available)
- bundler-audit
- importmap audit
- Dockerfile policy checks
- RuboCop

## Deployment and Traceability

The deploy workflow (`.github/workflows/deploy.yml`) builds and pushes an image to GHCR and records:

- pushed image tag
- exact pushed image digest
- immutable image reference (`image@digest`)

A `DEPLOYMENT REPORT` is added to the workflow summary and uploaded as a build artifact.
