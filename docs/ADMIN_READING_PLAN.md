# Admin Reading Entry Screens & Admin Overrides - Phased Implementation Plan

**Branch:** `admin-reading-panel`
**Started:** December 10, 2025

---

## PHASE 0 — PREP & SAFETY CHECK (Make workspace safe)

### Objective
- Ensure a reproducible starting point and avoid data loss.

### Tasks
1. Create branch: `git checkout -b admin-reading-panel`
2. Run tests / lint to confirm repo is healthy.
3. Ensure you have an admin test user (seed if needed) and local dev servers running:
   - Laravel (`php artisan serve --port=9000`)
   - Quasar dev (`npx quasar dev --port=8080`)
4. Create `docs/ADMIN_READING_PLAN.md` and paste this phased plan.

### Acceptance
- Branch created and pushed.
- Dev servers start with no runtime errors.
- Document file exists in repo.

### Deliverable PR
Tiny "chore: setup admin-reading-panel branch" (link in report).

### Status: 🟡 In Progress

---

## PHASE 1 — Read-only admin UI that mirrors user UI (no actions)

### Objective
- Build an admin page that looks identical but only reads backend data. This verifies API contract and UI parity.

### Tasks
1. Add route/page: `src/pages/admin/ReadingsEntryAdmin.vue`
2. Reuse existing components (header, meter card, reading display) but point to admin route.
3. Fetch bill + meter readings from `GET /api/v1/bills/{account}?period_start=&period_end=`
4. Render three states from existing examples:
   - normal reading-entry
   - cooldown-block message
   - collapsed/expanded
5. Add a small "Admin view" label only visible to admin.
### Acceptance
- Admin page visually matches user page for all three states.
- No admin actions visible yet.
- PR: "feat(admin): add read-only admin reading page" with screenshots.

### Tests
- Manual visual verification of parity with user page.

### Status: ⬜ Pending

---

## PHASE 2 — Audit table + backend admin endpoints (backend prep)

### Objective
- Add audit logging and admin endpoints skeletons required for future actions.

### Tasks (backend)
1. Migration: create `admin_actions` table
   - columns: `id`, `admin_id`, `action_type`, `reading_id`, `bill_id`, `payload(json)`, `reason`, `created_at`
2. Add middleware role: ensure admin middleware available (`role:admin`).
3. Implement controller stubs (no heavy logic yet):
   - `POST /api/v1/admin/readings/{id}/edit` (validate + store audit)
   - `POST /api/v1/admin/readings/{id}/delete` (soft delete + audit)
   - `POST /api/v1/admin/readings/add` (admin add + audit)
   - `POST /api/v1/admin/bills/{bill_id}/recompute` (enqueue recompute job + audit)
4. Return consistent responses (200 + job queued id).

### Acceptance
- Migrations run successfully.
- Admin endpoints exist and enforce admin middleware.
- Each endpoint writes an `admin_actions` record (payload minimal).
- PR: "feat(admin-api): add admin endpoints & audit migration" with endpoints list.

### Tests
- Unit tests verifying endpoints return 403 for non-admin, 200 for admin.
- DB test asserting `admin_actions` row inserted.

### Status: ⬜ Pending

---

## PHASE 3 — Admin toolbar UI + modals (client-side actions; UI only)

### Objective
- Add admin toolbar and UI for action flows (modals/forms) but initially call backend stubs added in Phase 2.

### Tasks
1. Create component `AdminBillToolbar.vue` with buttons:
   - Add Reading
   - Edit Reading
   - Delete Reading
   - Recompute Bill
   - View JSON
2. Create modals:
   - `EditReadingModal.vue`
   - `DeleteConfirmModal.vue` (reason text area)
   - `AddReadingModal.vue` (date/time/value + reason)
3. Hook toolbar buttons to open modals; on submit call backend admin endpoints (Phase 2).
4. Show confirmations and toasts for success/failure.

### Acceptance
- Toolbar appears on admin page.
- Clicking actions opens corresponding modal.
- Form submission calls admin endpoint and shows toast.
- PR: "feat(admin-ui): add AdminBillToolbar and modals" with screenshots.

### Tests
- Manual testing of modal flows.

### Status: ⬜ Pending

---

## PHASE 4 — Admin actions: implement edit/add/delete behavior + recompute integration

### Objective
- Make admin actions functional end-to-end (persist edits, queue recompute, refresh UI).

### Tasks (backend + frontend)
1. Backend: implement full logic for edit/add/delete endpoints:
   - Validate input, write reading changes (soft-delete or update), set flags (`admin_override`, `is_rollover`), write `admin_actions` with reason and payload.
   - Trigger `BillRecomputeJob` in background; store job id; return job reference.
2. Frontend: on modal submit:
   - POST to admin endpoint
   - Show spinner until job queued
   - Poll job status or subscribe to websocket for completion (poll acceptable)
   - On recompute complete, refresh `GET /api/v1/bills/...` and update UI
3. Implement audit view: AdminBillToolbar → View Audit opens sidebar listing recent `admin_actions` for account/meter.
4. Tests: add integration tests for a full edit → recompute → UI refresh flow.

### Acceptance
- Editing a reading persists changes and creates audit record.
- Recompute runs and updated bill snapshot shows new totals where applicable.
- Deleting a reading soft-deletes and triggers recompute.
- PR: "feat(admin-actions): implement reading edits and recompute" with logs and sample payloads.

### Tests
- Backend integration test: edit reading modifies reading record and enqueues job.
- E2E test (Cypress): admin edits reading and sees updated bill after recompute.

### Status: ⬜ Pending

---

## PHASE 5 — Overrides, flags, and rollback controls

### Objective
- Add admin override options, flags visible in UI, and undo/rollback ability.

### Tasks
1. UI: in `EditReadingModal` add override options (Accept as rollover, Replace meter start, Manual override).
2. Backend: apply business logic for each override type (set flags, recalc with rollover logic if needed).
3. UI: show flags next to readings (Estimated, Final, Admin override, Rollover).
4. Implement undo for recent admin actions: allow admin to revert last `admin_action` on that reading (soft rollback endpoint).
5. Add audit entries for undos.

### Acceptance
- Admin can choose override type; backend sets flags and recompute runs.
- Flags show correctly in reading history.
- Undo reverses last admin action and recompute runs.
- PR: "feat(admin-overrides): add override options and undo" with usage examples.

### Tests
- Unit tests for override business rules.
- Integration tests for rollback.

### Status: ⬜ Pending

---

## PHASE 6 — Security, tests, docs, and finalization

### Objective
- Harden endpoints, complete tests, and document admin flows.

### Tasks
1. Finalize authorization checks (ensure only admin role allowed).
2. Add rate limits/logging for admin endpoints (optional).
3. Complete manual testing and E2E coverage for admin flows.
4. Add documentation: `docs/ADMIN_READING_PLAN.md` updated with usage, endpoints, and example payloads.
5. Code review fixes and polish UI to ensure pixel parity with user pages.

### Acceptance
- All tests pass.
- Documentation present.
- PR: final merge PR with test reports and screenshots.

### Status: ⬜ Pending

---

## PHASE 7 — Cleanup & rollout

### Objective
- Merge to main, deploy to staging, monitor, and prepare rollback plan.

### Tasks
1. Merge `admin-reading-panel` into staging branch after approvals.
2. Deploy backend migration + endpoints to staging.
3. Deploy frontend to staging (build & copy).
4. Perform manual admin acceptance testing (seed admin account).
5. Monitor logs and confirm no breaking changes for user flows.
6. Rollout to production per release process.

### Acceptance
- Staging verification complete.
- No regressions in user-facing reading flows.
- Admin audit records logged correctly.

### Status: ⬜ Pending

---

## GENERAL RULES FOR AGENT

- Keep PRs small: one UI change or one backend change per PR.
- Include screenshots and sample cURL payloads in PR descriptions.
- Always log admin actions in `admin_actions` with minimal sensitive data.
- Do not modify production data in local tests; always use dev/staging.
- Report progress after each phase with: branch name, PR links, files changed, sample payloads, and screenshots.

---

## Progress Log

| Phase | Status | PR Link | Notes |
|-------|--------|---------|-------|
| 0 | ✅ Complete | - | Workspace setup, batch files created |
| 1 | ✅ Complete | - | Read-only admin UI, shared components created |
| 2 | ✅ Complete | - | Admin endpoints & migration created |
| 3 | ✅ Complete | - | Admin toolbar & modals wired up |
| 4 | 🟡 In Progress | - | Edit/add/delete working, recompute stub |
| 5 | ⬜ Pending | - | - |
| 6 | ⬜ Pending | - | - |
| 7 | ⬜ Pending | - | - |

## Files Created

### Frontend (Vue/Quasar)

**Shared UI Components** (`src/components/ui/`):
- `BillHeader.vue` - Header with date, deadline badge, navigation
- `MeterUsageCard.vue` - Meter card with usage stats, costs
- `MeterDigitDisplay.vue` - 8-digit/6-digit meter display
- `ReadingHistoryRow.vue` - Reading row with edit button
- `ReadingEntryPanel.vue` - Main panel combining all components
- `CooldownWarning.vue` - 24h cooldown warning
- `AdminReadingToolbar.vue` - Admin toolbar (Add/Edit/Delete/Recompute)

**Admin Pages** (`src/pages/admin/`):
- `ReadingsEntryAdmin.vue` - Main admin readings page
- `AdminDashboard.vue` - Dashboard placeholder
- `AdminBilling.vue` - Billing placeholder
- `AdminTariffs.vue` - Tariffs placeholder
- `AdminAccounts.vue` - Accounts placeholder
- `AdminAudit.vue` - Audit log placeholder

**Layout & Routes**:
- `src/layouts/AdminLayout.vue` - Admin layout with sidebar
- `src/router/routes.js` - Admin routes added
- `src/stores/auth.js` - Auth store with role management
- `src/services/adminApi.js` - Admin API service

### Backend (Laravel)

**Migration**:
- `database/migrations/2025_12_10_000001_create_admin_actions_table.php`

**Model**:
- `app/Models/AdminAction.php`

**Controller**:
- `app/Http/Controllers/Api/AdminReadingsController.php`

**Routes** (added to `routes/api.php`):
- `POST /api/v1/admin/readings/{id}/edit`
- `POST /api/v1/admin/readings/{id}/delete`
- `POST /api/v1/admin/readings/add`
- `POST /api/v1/admin/readings/{id}/flags`
- `POST /api/v1/admin/bills/{billId}/recompute`
- `POST /api/v1/admin/accounts/{accountId}/recompute-bill`
- `GET /api/v1/admin/audit-log`
- `POST /api/v1/admin/actions/{actionId}/undo`
- `GET /api/v1/admin/check-role`

### Batch Files

- `setup-and-run.bat` - Setup and run Quasar
- `start-quasar-dev.bat` - Start Quasar dev server
- `start-laravel.bat` - Start Laravel server
- `start-both-servers.bat` - Start both servers
- `run-admin-migration.bat` - Run admin_actions migration
- `run-all-migrations.bat` - Run all pending migrations

---

END.

