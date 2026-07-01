# 🌿 Clan — Family Care Hub

**Private family care coordination. No accounts, no cloud, no complexity.**

Clan is a local-first PWA for family caregivers. Track medications, appointments, and daily care logs — all on your device. Nothing leaves your home.

## Why Clan?

Caregiving coordination is information chaos disguised as logistics. Families juggle group texts, spreadsheets, sticky notes, and memory. None of these work for distributed families with multiple caregivers.

Existing care apps (Caring Village $15-25/mo, Medisafe, CaringBridge) all require accounts, cloud storage, subscriptions, and complex UIs that confuse senior users.

Clan is different:

- **100% local-first** — IndexedDB in your browser. Nothing on our servers.
- **No accounts** — No signup, no email, no password, no tracking.
- **No subscription** — Free forever. Pay only for optional family sync.
- **Designed for seniors** — Large text, high contrast, simple navigation.
- **Offline** — Works without internet once loaded.
- **PWA** — Installable on any device. Open a URL, start tracking.

## Features

### 💊 Medication Tracking
- Add medications with dosage and schedule
- Log doses as taken/skipped
- Pause or delete meds as needed
- Multiple time slots per day (daily, twice daily, custom)

### 📅 Appointments
- Track doctor visits, tests, appointments
- Date, time, provider, location, notes
- Sorted and grouped by date

### 📝 Daily Care Log
- Log mood (5 levels with emoji)
- Track symptoms (Fatigue, Pain, Nausea, etc.)
- Notes and meals
- One entry per day — simple, focused

### 📋 Dashboard
- Today's medications at a glance
- Today's appointments
- Quick log access
- One-tap dose logging

### 🔒 Privacy
- All data stored in IndexedDB (your browser)
- No servers, no cloud, no exfiltration
- Export your data as JSON anytime
- Zero tracking, zero analytics, zero third-party scripts

## Tech

- **Vanilla HTML/CSS/JS** — Zero dependencies, zero build tools
- **IndexedDB** — Persistent local storage (not localStorage)
- **PWA** — Service worker, manifest, offline support
- **~40KB total** — Tiny footprint
- **Responsive** — Works on phone, tablet, desktop

## Deployment

Serve as static files on any web server:

```bash
# GitHub Pages, Netlify, Vercel — any static host
# Or serve locally:
python3 -m http.server 8080
# Open http://localhost:8080
```

## Data

Export your data anytime via the ⬇️ button in the header. Imports coming soon.

## License

MIT
