# Frontend Billing Integration - Implementation Status

## ✅ Completed

1. **Feature Flag System**
   - Created `src/stores/billing.js` with Pinia store
   - Persists to localStorage
   - Default: false (uses frontend billing)

2. **Billing API Service**
   - Created `src/services/billingApi.js`
   - Methods: `getBill()`, `finalizeBill()`, `recomputeBill()`, `getBillById()`, `listBills()`
   - Handles errors and returns consistent response format

3. **AccountCost.vue Integration**
   - ✅ Added backend billing support
   - ✅ Fetches bill from backend when flag enabled
   - ✅ Transforms backend data to match frontend format
   - ✅ Falls back to frontend calculation when flag disabled
   - ✅ Shows loading indicator and error messages
   - ✅ Badge indicator when using backend

4. **Admin Toggle Component**
   - Created `src/components/BillingToggle.vue`
   - Added to `MainPage.vue`
   - Allows toggling backend billing on/off for testing

5. **Documentation**
   - Created `BILLING_BACKEND_IMPLEMENTATION.md` with complete backend requirements

6. **Backend Billing Test UI**
   - Added test panel on `MainPage.vue` with buttons to call backend estimate/finalize and show results

## ⏳ In Progress / Remaining

1. **Rollover Modal & backend persistence**
   - Frontend sends `is_rollover` + `rollover_reason_code` (done in `MeterComponentWithInput.vue`)
   - Backend endpoints should accept/record and enforce `editable_until` (pending)

## 📝 Implementation Notes

### Backend API Expected Format

The frontend expects the backend to return:

```json
{
  "status": "ESTIMATE|PREVIEW|FINALIZED|PROVISIONAL",
  "billing_period_start": "2025-11-23T00:00:00+02:00",
  "billing_period_end": "2025-12-23T00:00:00+02:00",
  "totals": {
    "subtotal": 1234.56,
    "vat": 185.18,
    "total": 1419.74
  },
  "per_meter": [
    {
      "meter_id": 1,
      "title": "Water in",
      "value": 456.78,
      "reading": 123.45,
      "line_type": "meter_usage",
      "commodity": "water",
      "is_vatable": true
    }
  ],
  "account_charges_snapshot": [
    {
      "id": 1,
      "title": "Rates",
      "value": 500.00,
      "is_active": true
    }
  ],
  "tariff_snapshot": {...},
  "fingerprint": "...",
  "reason_codes": [],
  "quality_score": 100
}
```

### API Endpoints Required

1. **GET /api/v1/bills**
   - Query params: `account_id`, `period_end`, `mode` (estimate|preview|finalize)
   - Returns bill snapshot (not persisted unless mode=finalize)

2. **POST /api/v1/bills**
   - Body: `account_id`, `period_start`, `period_end`, `mode=finalize`, `idempotency_key` (optional)
   - Persists bill and returns persisted bill data

3. **POST /api/v1/bills/{id}/recompute**
   - Admin only
   - Recomputes and updates existing bill

4. **GET /api/v1/bills/{id}**
   - Returns persisted bill by ID

5. **POST /api/v1/meter/add-readings** (update existing)
   - Add: `is_rollover`, `rollover_reason_code`, `max_reading_value`
   - Set `editable_until` automatically for rollover readings

6. **POST /api/v1/meter/update-readings** (update existing)
   - Check `editable_until` for user edits
   - Allow admin edits always
   - Update `edit_audit_trail`

## 🔄 Next Steps

1. Ensure backend reading endpoints record rollover + enforce edit window
2. Add bill line items if needed; finalize storage model
3. Auto-recompute when forward readings arrive; improve LateReadingAdjustmentService
4. Parity tests and shadow compare

## 🧪 Testing

To test the frontend integration:

1. Start frontend: `quasar dev`
2. Toggle "Use Backend Billing" in MainPage
3. Use the new “Backend Billing Test” panel on MainPage (estimate/finalize)
4. View account/meter cost screens; should show “Backend” badge
5. Check browser console for API calls

## 📁 Files Modified/Created

### Created
- `src/stores/billing.js`
- `src/services/billingApi.js`
- `src/components/BillingToggle.vue`
- `BILLING_BACKEND_IMPLEMENTATION.md`
- `FRONTEND_IMPLEMENTATION_STATUS.md`

### Modified
- `src/components/AccountCost.vue` (backend integration)
- `src/components/MeterCost.vue` (backend integration)
- `src/pages/MainPage.vue` (BillingToggle + backend billing test panel)

### To Be Modified
- Backend reading endpoints to record rollover flags and edit window

