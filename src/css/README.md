# Theme and design tokens

This folder is the single source of truth for UI tokens:
- `quasar.variables.scss` – brand colors and shared tokens
- `app.scss` – global styles that should consume the tokens (no raw hex)

Usage guidelines
- Do not hard-code hex colors in components; reference the variables in `quasar.variables.scss`.
- If you add new colors/spacing/radius tokens, define them in `quasar.variables.scss` first.
- Import production overrides here so dev and prod match visually.

Common variables (examples)
- `$primary`, `$secondary`, `$accent`, `$positive`, `$negative`, `$warning`, `$info`, `$dark`, `$grey`
- Optional tonal steps: `$primary-dark`, `$primary-light`

Linting / checks
- Search for raw hex: `rg "#[0-9A-Fa-f]{6}" src | rg -v "quasar.variables"`
- Prefer adding a stylelint/eslint rule to block raw hex in Vue/SCSS files.

Build/dev
- Dev uses the same tokens. If the dev UI looks different, ensure `quasar.variables.scss` is loaded and no production-only CSS lives outside `src/`.






