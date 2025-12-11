# MyCities - Water Meter Reading Application

A Vue 3 + Quasar application for water meter reading management. This prototype is fully navigable, uses localStorage for data persistence, and is designed to be easily swapped to a real backend API.

## Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Building for Production](#building-for-production)
- [PWA Mode](#pwa-mode)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Replacing localStorage with API](#replacing-localstorage-with-api)
- [Design Tokens](#design-tokens)
- [Internationalization](#internationalization)
- [Component Documentation](#component-documentation)
- [Version Management](#version-management)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or with specific port
npx quasar dev --port 9000
```

The app will be available at `http://localhost:8080/web-app/` (or your specified port).

## Development

### Development Server

```bash
# Standard development
npm run dev

# With network access (for mobile testing)
npm run dev:quasar

# PWA development mode
npm run dev:pwa
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Building for Production

### SPA Build

```bash
# Build SPA
npm run build:spa

# The output will be in dist/spa/
```

### Serving Production Build

```bash
# Serve the built SPA locally
npm run serve:spa

# Or with a specific port
npx serve -s dist/spa -l 3000
```

### Deploy to Laravel Server

```bash
# Build and deploy to Laravel public folder
npm run deploy:local
```

## PWA Mode

### Development

```bash
npm run dev:pwa
```

### Production Build

```bash
npm run build:pwa
# Output in dist/pwa/
```

### PWA Configuration

PWA settings are in `quasar.config.js` under the `pwa` section:
- Manifest configuration (app name, colors, icons)
- Service worker settings
- Workbox configuration

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Watch mode
npm run test:unit:watch

# With coverage
npm run test:coverage
```

### Smoke Tests

```bash
# Run smoke tests only
npm run test:smoke
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
npm run test:e2e

# Update visual snapshots
npm run test:visual
```

### CI Pipeline

```bash
# Run full CI check (lint + test + build)
npm run ci
```

## Project Structure

```
src/
├── boot/                 # Quasar boot files (axios, i18n, etc.)
├── components/
│   └── ui/              # Reusable UI components
│       ├── NumericKeypad.vue
│       ├── DigitGroup.vue
│       ├── BillHeader.vue
│       └── ...
├── css/
│   └── quasar.variables.scss  # Quasar theme variables
├── i18n/                # Internationalization
│   ├── index.js         # i18n configuration
│   └── en-US/           # English translations
├── layouts/             # App layouts
│   ├── UserLayout.vue
│   └── AdminLayout.vue
├── pages/               # Route pages
│   ├── LoginPage.vue
│   ├── AccountSetupPage.vue
│   ├── AccountsListPage.vue
│   └── user/
│       ├── HomePage.vue
│       ├── MeterInputPage.vue
│       ├── ReadingsListPage.vue
│       └── ...
├── router/              # Vue Router configuration
├── services/            # Data services
│   ├── dataService.js   # API abstraction layer
│   ├── authStorage.js   # Authentication (localStorage)
│   └── readingsStorage.js  # Readings (localStorage)
└── styles/
    └── tokens.scss      # Design tokens

tests/
├── setup.js             # Test setup
├── smoke/               # Smoke tests
│   ├── auth.test.js
│   ├── readings.test.js
│   └── accounts.test.js
└── e2e/                 # E2E tests
    └── auth.spec.js
```

## Replacing localStorage with API

The app uses a data abstraction layer in `src/services/dataService.js`. To switch to a real API:

### 1. Update Configuration

```javascript
// In src/services/dataService.js
const CONFIG = {
  API_BASE_URL: 'https://api.mycities.co.za/v1', // Set your API URL
  USE_MOCK_DELAY: false,
  MOCK_DELAY_MS: 0,
};
```

### 2. API Endpoints Expected

The service expects these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/logout` | Logout |
| GET | `/accounts` | List all accounts |
| GET | `/accounts/:id` | Get account by ID |
| POST | `/accounts` | Create account |
| PATCH | `/accounts/:id` | Update account |
| DELETE | `/accounts/:id` | Delete account |
| GET | `/readings` | List all readings |
| GET | `/readings/:id` | Get reading by ID |
| POST | `/readings` | Save new reading |
| DELETE | `/readings` | Clear all readings |

### 3. Authentication Headers

The service automatically adds `Authorization: Bearer <token>` header when a session exists. Ensure your API returns a token on login.

## Design Tokens

Design tokens are centralized in `src/styles/tokens.scss`:

```scss
// Colors
$mc-primary: #3294B8;
$mc-negative: #cc0000;

// Typography
$mc-font-primary: 'Roboto', sans-serif;

// Spacing
$mc-space-md: 16px;

// Usage in components
@import '@/styles/tokens.scss';

.my-component {
  color: $mc-primary;
  padding: $mc-space-md;
}
```

CSS custom properties are also available:

```css
.my-element {
  color: var(--mc-primary);
  padding: var(--mc-space-md);
}
```

## Internationalization

The app uses vue-i18n for internationalization:

### Usage in Templates

```vue
<template>
  <p>{{ $t('common.welcome') }}</p>
  <q-btn :label="$t('auth.login.submit')" />
</template>
```

### Adding a New Language

1. Create folder: `src/i18n/af-ZA/`
2. Copy `src/i18n/en-US/index.js` and translate
3. Update `src/i18n/index.js`:

```javascript
import afZA from './af-ZA';

export const messages = {
  'en-US': enUS,
  'af-ZA': afZA,
};
```

## Component Documentation

All components include:
- JSDoc comments describing purpose
- `data-test` attributes for testing
- ARIA labels for accessibility

### Key Components

| Component | Location | Description |
|-----------|----------|-------------|
| `NumericKeypad` | `components/ui/` | Numeric input keypad |
| `DigitGroup` | `components/ui/` | Meter digit input group |
| `BillHeader` | `components/ui/` | Bill period header |
| `MeterBar` | `components/ui/` | Meter type indicator |

### Test IDs Convention

```
data-test="<page>-<element>"
data-test="login-email"
data-test="login-submit"
data-test="keypad-key-5"
```

## Version Management

### Versions Folder

Saved versions are stored in `versions/` folder. Each version is a complete snapshot that can be run independently.

### Preview a Version

```bash
# Start version preview server
npm run preview:version -- --version=v1.0.0

# Or manually serve a version
npx serve -s versions/v1.0.0/dist -l 4000
```

### Creating a Version

```bash
# Build and save as version
npm run build:spa
mkdir versions/v1.0.0
cp -r dist/spa versions/v1.0.0/dist
```

## Demo Account

For testing, a demo account is always available:

- **Email:** demo@mycities.co.za
- **Password:** demo123

Or click "Use Demo Account" on the login page.

## Mobile Considerations

### Viewport Handling

The app handles mobile keyboards using:
- `visualViewport` API for keyboard detection
- `ResizeObserver` for dynamic height adjustment
- `scrollIntoView` for active input fields

### Safe Area Insets

iOS safe areas are handled via CSS:

```css
padding-bottom: var(--safe-area-inset-bottom);
```

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- `prefers-reduced-motion` respected for animations
- Focus management on route changes

## License

Private - All rights reserved.
