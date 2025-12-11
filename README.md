# MyCities - Vue/Quasar Frontend

A municipal utility management app for meter readings and billing.

---

## Project Structure

This is a **two-part project**:

| Folder | Technology | Purpose | Port |
|--------|------------|---------|------|
| `C:\MyCities\MyCities-Vue-Quasar` | Vue 3 + Quasar | User-facing mobile app | 9000 |
| `C:\MyCities\MyCities-Server-Admin---Laravel` | Laravel PHP | Backend API + Admin Panel | 8000 |

---

## Quick Start

### 1. Start Laravel Backend (API + Admin Panel)

```bash
cd C:\MyCities\MyCities-Server-Admin---Laravel
php artisan serve --port=8000
```

**Admin Panel:** http://localhost:8000/admin/login

| Field | Value |
|-------|-------|
| Email | `admin@mycities.local` |
| Password | `admin123` |

To create/reset admin user:
```bash
php create-admin.php
```

### 2. Start Vue/Quasar Frontend (User App)

```bash
cd C:\MyCities\MyCities-Vue-Quasar
npm install
npx quasar dev --port=9000
```

**User App:** http://localhost:9000/web-app/#/

| Account | Email | Password |
|---------|-------|----------|
| Demo User | `demo@mycities.co.za` | `demo123` |
| Demo Admin | `admin@mycities.co.za` | `admin123` |

---

## What Was Built (Session Summary)

### Pages Created/Updated

| Page | Route | Description |
|------|-------|-------------|
| `LoginPage.vue` | `/login` | User login with demo account button |
| `AccountSetupPage.vue` | `/account-setup` | New user registration |
| `DashboardPage.vue` | `/` | Main billing dashboard with period navigation |
| `WaterReadingPage.vue` | `/water-reading` | Water meter input (6 RED + 4 BLACK digits) |
| `ElectricityReadingPage.vue` | `/electricity-reading` | Electricity meter input |
| `ReadingsListPage.vue` | `/readings-list` | History of saved readings |
| `ReadingPreviewPage.vue` | `/reading/:id` | View individual reading details |
| `SettingsPage.vue` | `/settings` | App settings + Reset Demo Data |
| `AdminLoginPage.vue` | `/admin/login` | Separate admin login |
| `AdminDashboard.vue` | `/admin/dashboard` | Admin panel dashboard |

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `NumericKeypad.vue` | `src/components/ui/` | Reusable 0-9 keypad with Clear/Enter |
| `DigitGroup.vue` | `src/components/ui/` | Clickable digit display with flashing caret |

### Services (Data Layer)

| Service | Location | Purpose |
|---------|----------|---------|
| `dataService.js` | `src/services/` | Abstraction layer - swap localStorage for API |
| `authStorage.js` | `src/services/` | User authentication (localStorage) |
| `readingsStorage.js` | `src/services/` | Meter readings storage (localStorage) |
| `seedData.js` | `src/services/` | Demo data: tariffs, meters, billing periods |

### Layouts

| Layout | Purpose |
|--------|---------|
| `AuthLayout.vue` | Mobile phone container for all screens |
| `AdminLayout.vue` | Admin panel with sidebar navigation |

---

## Architecture Notes

### Data Flow (Current - LocalStorage)

```
User App (Vue/Quasar)
    ↓
dataService.js  ←  Abstraction layer
    ↓
authStorage.js / readingsStorage.js  ←  localStorage
```

### Data Flow (Production - API)

```
User App (Vue/Quasar)
    ↓
dataService.js  ←  Change CONFIG.API_BASE_URL
    ↓
Laravel API (localhost:8000/api/v1/...)
    ↓
MySQL Database
```

### To Switch to Real API

Edit `src/services/dataService.js`:

```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api/v1', // Set this
  USE_MOCK_DELAY: false,
};
```

---

## Billing Engine

The app has **two billing implementations**:

1. **Frontend** (`src/services/waterDurban.js`) - Tiered water rates, flat electricity
2. **Backend** (`app/Services/BillingEngine.php` in Laravel) - Full billing with tariff templates

Toggle via `src/stores/billing.js`:
```javascript
useBackendBilling: false  // true = use Laravel API
```

### Tariff Structure (Laravel Admin)

- **Regions** → Geographic areas
- **Tariff Templates** → Pricing rules linked to regions
- **Tariff Tiers** → Water consumption tiers with input/output rates
- **Fixed Costs** → Rates, VAT, infrastructure charges

---

## Key Design Decisions

1. **Mobile-first**: All screens render in a phone-sized container
2. **Single screen rule**: Only one QPage visible at a time
3. **Header color**: Light grey `#E0E0E0` with black navigation arrows
4. **Water meter**: RED group (6 digits) + BLACK group (4 digits)
5. **Clear button**: Resets active group to "0" (not empty)
6. **Separate reading screens**: Water and Electricity are different routes

---

## File Locations

```
src/
├── pages/
│   ├── LoginPage.vue
│   ├── AccountSetupPage.vue
│   ├── user/
│   │   ├── DashboardPage.vue      ← Main billing screen
│   │   ├── WaterReadingPage.vue   ← Water meter input
│   │   ├── ElectricityReadingPage.vue
│   │   ├── ReadingsListPage.vue
│   │   └── SettingsPage.vue
│   └── admin/
│       ├── AdminLoginPage.vue
│       ├── AdminDashboard.vue
│       └── AdminTariffs.vue       ← Tariff management (placeholder)
├── components/ui/
│   ├── NumericKeypad.vue
│   └── DigitGroup.vue
├── services/
│   ├── dataService.js             ← API abstraction
│   ├── authStorage.js             ← Auth (localStorage)
│   ├── seedData.js                ← Demo data
│   └── waterDurban.js             ← Frontend billing engine
├── layouts/
│   ├── AuthLayout.vue             ← Phone container
│   └── AdminLayout.vue            ← Admin sidebar
└── router/
    └── routes.js                  ← All route definitions
```

---

## Build & Deploy

### Development
```bash
npx quasar dev --port=9000
```

### Production Build
```bash
npx quasar build -m spa
```

### Deploy to Laravel
```bash
robocopy dist\spa C:\MyCities\MyCities-Server-Admin---Laravel\public\web-app /MIR
```

### PWA Build
```bash
npx quasar build -m pwa
```

---

## Testing

### Run Unit Tests
```bash
npm run test:unit
```

### Run Smoke Tests
```bash
npm run smoke
```

### Reset Demo Data
Go to Settings → "Reset to Demo Data" button, or clear localStorage manually.

---

## Agent Rules

See `src/AGENT_RULES.md`:
- Do not take liberties - implement exactly what is requested
- No extra labels (removed "Liters"/"Kiloliters")
- Follow digit limits: RED = 6, BLACK = 4
- Clear button shows "0", not empty

---

## Next Steps (Pending)

1. Connect Vue app to Laravel API (swap localStorage)
2. Implement tariff template selection per user
3. Use real billing engine calculations from Laravel
4. Build out admin tariff management screens
