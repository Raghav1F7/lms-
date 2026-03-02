# LMS Rails App

## CI/CD and Release Governance

This repository uses GitHub Actions as the execution layer for CI and CD, with Render as the production runtime.

### CI policy (required before merge)

Pull requests must pass all required checks:

- `RSpec`
- `Security scans` (Brakeman, bundler-audit, importmap audit)
- `RuboCop`
- `Docker build validation`
- `CI report`

If any check fails, the PR must not be merged.

### CD policy (automatic on `main`)

On every push to `main`:

1. Build and push Docker image tagged with commit SHA.
2. Trigger Render web deploy via deploy hook.
3. Trigger Render worker deploy via deploy hook (if configured).
4. Validate production health endpoint (`/up`) returns `200`.
5. Publish a deployment report with commit, image tag/digest, and rollout status.

### Required repository settings

Configure branch protection for `main` in GitHub:

- Require pull request before merge.
- Require at least 1 approval.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Disallow direct pushes to `main`.
- Disallow force pushes.

### Required secrets

Set these GitHub Actions repository secrets:

- `RENDER_DEPLOY_HOOK_URL` (required)
- `RENDER_WORKER_DEPLOY_HOOK_URL` (optional)
- `PRODUCTION_HEALTHCHECK_URL` (required, e.g. `https://your-app.onrender.com/up`)
