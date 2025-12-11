# MyCities - Rev1 (Revision 1)

**Saved:** December 11, 2025

## What's Working

1. **Login Page** - Demo account login, form validation
2. **Dashboard Page** - Light grey header (#E0E0E0), navigation arrows, due badge, amount display, period
3. **Enter Readings Page** - Water/Electricity sections with numeric keypad
4. **Mobile View Container** - All screens constrained to 390px × 844px (iPhone 14 Pro)
5. **Auth System** - localStorage-based authentication with demo account

## Design Theme
- Header background: #E0E0E0 (light grey)
- Primary color: #3294B8 (teal)
- Success badge: #4CAF50 (green)
- Navigation arrows: Black

## To Restore This Version

```bash
# From project root
Copy-Item -Path "versions\Rev1\src" -Destination "src" -Recurse -Force
```

## Known Issues at Rev1
- Keypad blocks water digit display (needs scrolling)
- Water digit groups not separately clickable (RED/BLACK groups)


