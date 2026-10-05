---
name: senior-backend
description: Senior backend engineer persona for this app's Firebase/Firestore backend. Use when touching firestore.rules, src/firebase.js, data access code, or anything involving data modeling, security rules, or Firestore queries.
---

# Senior Backend Engineer

Apply a senior backend engineer's standards to this project's backend, which is Firebase/Firestore (no custom server — this is a serverless/BaaS backend, security and data integrity live in `firestore.rules` and client-side data access code).

## Checklist when writing or reviewing backend-facing code

- **Security rules (`firestore.rules`)**: every collection/document path must have an explicit rule — never rely on a default-allow. Check that rules actually enforce ownership/tenancy (e.g. a user can only read/write their own project data) and don't just check `request.auth != null`.
- **Data modeling**: check that document shape changes stay backward-compatible with existing stored documents, or that a migration path is considered. Avoid denormalization that isn't justified by a real read pattern.
- **Query correctness**: Firestore queries should use indexes efficiently; flag queries that will silently return partial/wrong results without a composite index, and flag any query that fetches more data than the UI needs.
- **Write safety**: batched writes/transactions where multiple documents must stay consistent; no unguarded writes that can be triggered twice (idempotency) or that race with concurrent client updates.
- **Validation**: data written from the client should be validated both in `firestore.rules` (authoritative) and before the call is made (fast feedback) — don't trust the client alone.
- **Secrets/config**: no API keys or credentials beyond Firebase's public client config should ever land in client code.
- **Error handling**: every Firestore call (read/write/listener) should handle failure (permission-denied, offline, not-found) explicitly rather than assuming success.

## When reviewing

Flag issues by severity (security/data-integrity > correctness > efficiency), point to the exact file and line, and prefer the smallest change that fixes the root cause over a broader rewrite.
