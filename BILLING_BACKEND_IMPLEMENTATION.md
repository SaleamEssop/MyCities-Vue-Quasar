# Billing Backend Implementation Guide

This document outlines the backend implementation requirements for the billing system migration.

## Overview

The frontend has been updated to support both frontend (waterDurban.js) and backend billing via a feature flag. The backend implementation needs to be completed in the Laravel repository.

## Frontend Changes Completed

✅ Feature flag system (`src/stores/billing.js`)
✅ Billing API service (`src/services/billingApi.js`)
✅ AccountCost.vue updated to use backend when flag enabled
✅ Admin toggle component (`src/components/BillingToggle.vue`)
⏳ MeterCost.vue - needs update (similar to AccountCost.vue)
⏳ Rollover modal implementation
⏳ Reading submission with rollover flags

## Backend Implementation Requirements

### 1. Database Migrations

Create the following migrations in the Laravel backend:

#### `add_rollover_fields_to_meter_readings_table.php`
```php
- is_rollover: boolean, default false
- rollover_reason_code: string, nullable
- editable_until: timestampTz, nullable
- max_reading_value: decimal(20,6), nullable
- edited_by_admin: boolean, default false
- edit_audit_trail: json, nullable
```

#### `create_bills_table.php`
```php
- id: bigIncrements
- account_id: unsignedBigInteger, foreign(accounts.id)
- billing_cycle_type: string ('month_to_month'|'date_to_date')
- period_start: datetimeTz, index
- period_end: datetimeTz, index
- tariff_template_id: unsignedBigInteger, nullable, foreign
- tariff_version_id: unsignedBigInteger, nullable
- tariff_snapshot: json
- items_snapshot: json
- account_charges_snapshot: json, nullable
- subtotal: decimal(14,4)
- vat: decimal(14,4)
- total: decimal(14,4)
- status: string ('FINALIZED'|'PROVISIONAL'|'ESTIMATE'|'REQUIRES_MANUAL_REVIEW'|'FAILED')
- reason_codes: json, nullable
- quality_score: integer, nullable
- fingerprint: string, unique
- engine_version: string, nullable
- frontend_comparison_hash: string, nullable
- created_by: string, nullable
- billing_date: integer, nullable (day of month 1-31)
- timestampsTz
- unique: [account_id, period_start, period_end]
```

#### `create_bill_line_items_table.php`
```php
- id: bigIncrements
- bill_id: unsignedBigInteger, foreign(bills.id), cascade
- meter_id: unsignedBigInteger, nullable, foreign(meters.id)
- line_type: string ('meter_usage'|'account_fixed_charge'|'surcharge'|'vat')
- commodity: string ('electricity'|'water'|'rates'|'refuse'|'other')
- boundary_start_value: decimal(20,6)
- boundary_start_ts: datetimeTz
- boundary_start_source: string ('reading_id:123'|'INTERPOLATED')
- boundary_end_value: decimal(20,6)
- boundary_end_ts: datetimeTz
- boundary_end_source: string
- consumption_units: decimal(20,6)
- standing_charge: decimal(14,4), default 0
- usage_charge: decimal(14,4), default 0
- surcharges: json, nullable
- vat: decimal(14,4), default 0
- is_vatable: boolean, default true
- subtotal: decimal(14,4)
- total: decimal(14,4)
- flags: json, nullable
- raw_readings_used: json, nullable
- calculation_trace: json, nullable
- parent_line_item_id: unsignedBigInteger, nullable, foreign
- timestampsTz
- index: [bill_id, meter_id]
```

#### `create_bill_readings_table.php`
```php
- id: bigIncrements
- bill_id: unsignedBigInteger, foreign(bills.id), cascade
- meter_reading_id: unsignedBigInteger, nullable, foreign(meter_readings.id)
- meter_id: unsignedBigInteger, foreign(meters.id), cascade
- reading_value: decimal(20,6)
- reading_ts: datetimeTz
- role: string ('BEFORE_START'|'AFTER_START'|'BEFORE_END'|'AFTER_END'|'IN_PERIOD')
- timestampsTz
```

#### `create_tariff_versions_table.php` (if not exists)
```php
- id: bigIncrements
- tariff_template_id: unsignedBigInteger, foreign(tariff_templates.id)
- version_label: string
- pricing_json: json
- effective_from: date
- effective_to: date, nullable
- timestampsTz
- index: [tariff_template_id, effective_from, effective_to]
```

### 2. Service Classes

Create under `app/Services/Billing/`:

1. **ReadingEngine.php**
   - `deriveBoundaries(Meter, Carbon, Carbon): array`
   - `hasMissingForwardReading(Meter, Carbon): bool`
   - Handles interpolation, rollover detection
   - Max lookback: 24 months

2. **BillingPeriodResolver.php**
   - `resolve(Account, ?Carbon, ?Carbon, string): array`
   - Handles month-to-month and date-to-date cycles
   - Gets billing_date from account's defaultFixedCost

3. **TariffResolver.php**
   - `resolve(int, Carbon, Carbon): array`
   - Returns tariff version(s) for period
   - Handles tariff changes mid-period

4. **BillingStrategyInterface.php**
   - Interface for billing strategies

5. **MonthToMonthBilling.php**
   - Implements BillingStrategyInterface
   - Calculates water (tiered) and electricity (flat) costs

6. **BillingEngine.php**
   - `compute(Account, ?Carbon, ?Carbon, array): array`
   - Orchestrates billing calculation
   - Returns bill data structure

7. **BillOrchestrator.php**
   - `orchestrate(Account, ?Carbon, ?Carbon, array): Bill`
   - Handles persistence, idempotency, fingerprint generation

### 3. Models

Create Eloquent models:
- `Bill.php`
- `BillLineItem.php`
- `BillReading.php`
- `TariffVersion.php` (if not exists)

### 4. API Endpoints

#### Routes (`routes/api.php`)
```php
Route::prefix('v1')->group(function () {
    Route::get('/bills', [BillController::class, 'index']); // List bills
    Route::get('/bills/{id}', [BillController::class, 'show']); // Get bill
    Route::post('/bills', [BillController::class, 'store']); // Finalize bill
    Route::post('/bills/{id}/recompute', [BillController::class, 'recompute']); // Admin only
});
```

#### BillController
- `index()` - GET /v1/bills?account_id=&period_start=&period_end=&mode=estimate
- `show($id)` - GET /v1/bills/{id}
- `store()` - POST /v1/bills (finalize mode)
- `recompute($id)` - POST /v1/bills/{id}/recompute (admin only)

### 5. Jobs

#### `BillRecomputeJob.php`
- Triggered when new reading arrives
- Recomputes PROVISIONAL bills
- Dispatched via event listener

### 6. Artisan Commands

#### `billing:shadow-compare`
```bash
php artisan billing:shadow-compare --account=ID --period_start=... --period_end=...
```
- Runs backend calculation
- Compares with frontend (waterDurban.js)
- Saves diff to `storage/billing-parity/{account}_{period}.json`
- Tolerance: ±0.01 ZAR per line, 0.1% for totals

### 7. Seeders

Create seeders for test data:
- Regions (Durban)
- TariffTemplates (water tiered + electricity flat)
- Accounts (with billing_date)
- Meters (with max_reading values)
- Readings (boundary + test cases)
- Users (admin + test user)

### 8. Reading Submission Updates

Update `POST /v1/meter/add-readings` endpoint:
- Accept `is_rollover: boolean`
- Accept `rollover_reason_code: string`
- Set `editable_until: now + 24 hours` for rollover readings
- Store `max_reading_value` based on meter type

Update `PUT /v1/meter/update-readings` endpoint:
- Check `editable_until` for user edits
- Allow admin edits always
- Update `edit_audit_trail`

## API Response Format

### GET /v1/bills (estimate mode)
```json
{
  "status": "ESTIMATE",
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
  "tariff_snapshot": {...},
  "fingerprint": "...",
  "reason_codes": [],
  "quality_score": 100,
  "persisted": false
}
```

## Key Implementation Notes

1. **Rollover Detection**
   - Electricity max: 99999.9
   - Water max: 9999.9999
   - Formula: `consumption = max_value + end_value - start_value`

2. **VAT Calculation**
   - Rate: 15%
   - Non-VATable: Rates, Rates Rebate, Enter Your Billing Date
   - VATable: All meter usage, surcharges, other fixed charges

3. **Water Tariff Structure**
   - Tiered rates with min/max per tier
   - Each tier: input_rate, output_rate, output_percentage
   - Surcharges: Infrastructure Surcharge, Sewage Disposal Charge

4. **Electricity Tariff**
   - Flat rate: R2.2425/kWh (currently)
   - Should support tiered rates for future

5. **Billing Period Logic**
   - Default billing_date: 24 (day of month)
   - If current day >= billing_date: bill for next month
   - Period: (billing_date - 1) of previous month to (billing_date - 1) of current month

6. **Missing Forward Reading**
   - If no reading after period_end: consumption = 0, status = PROVISIONAL
   - When forward reading arrives: trigger BillRecomputeJob

## Testing Requirements

1. Parity tests vs frontend waterDurban.js
2. Unit tests for ReadingEngine (interpolation, rollover)
3. Unit tests for BillingEngine (water tiered, electricity flat)
4. Integration tests for API endpoints
5. Shadow compare for sample accounts

## Deployment Plan

1. Feature flag: `backend_billing_enabled` (default: false)
2. Shadow-run mode: compute and log diffs
3. Internal testing: enable for admin users
4. Gradual rollout: increase % of accounts
5. Full switch: deprecate frontend billing

## Files to Create in Laravel Backend

```
database/migrations/
  - YYYY_MM_DD_HHMMSS_add_rollover_fields_to_meter_readings_table.php
  - YYYY_MM_DD_HHMMSS_create_bills_table.php
  - YYYY_MM_DD_HHMMSS_create_bill_line_items_table.php
  - YYYY_MM_DD_HHMMSS_create_bill_readings_table.php
  - YYYY_MM_DD_HHMMSS_create_tariff_versions_table.php

app/Models/
  - Bill.php
  - BillLineItem.php
  - BillReading.php
  - TariffVersion.php

app/Services/Billing/
  - ReadingEngine.php
  - BillingPeriodResolver.php
  - TariffResolver.php
  - BillingStrategyInterface.php
  - MonthToMonthBilling.php
  - BillingEngine.php
  - BillOrchestrator.php

app/Http/Controllers/
  - BillController.php

app/Jobs/
  - BillRecomputeJob.php

app/Console/Commands/
  - BillingShadowCompareCommand.php

database/seeders/
  - SampleDataSeeder.php
```

## Next Steps

1. ✅ Frontend feature flag and API service (DONE)
2. ✅ AccountCost.vue backend integration (DONE)
3. ⏳ MeterCost.vue backend integration
4. ⏳ Rollover modal implementation
5. ⏳ Backend implementation (Laravel repo)
6. ⏳ Shadow compare command
7. ⏳ Seeders and test data
8. ⏳ Parity testing







