# Clan — Go-to-Market Posts

## Hacker News "Show HN"

**Title:** Show HN: Clan – Family care coordination that doesn't need your data

I built a care coordination app for families managing aging parents, medications, and doctor visits. Unlike every other option, it doesn't require accounts, cloud storage, or subscriptions.

**The problem:** 53 million family caregivers in the US juggle meds, appointments, and daily updates across group texts, spreadsheets, and sticky notes. Existing apps (Caring Village, Medisafe, CaringBridge) all require accounts, cloud storage, subscriptions, and UIs that confuse elderly users.

**What I built:** Clan is a local-first PWA.

- 💊 **Medication tracking** — Add meds, schedule doses, one-tap taken/skipped logging
- 📅 **Appointments** — Doctor visits, tests, everything in one place
- 📝 **Daily care log** — Mood, symptoms, meals, notes — one entry per day
- 📋 **Dashboard** — Today's meds + appointments + quick log at a glance
- 🌙 Dark mode, 📱 PWA installable, ⬇️ JSON export

**The privacy difference:**
- 100% local-first — IndexedDB in your browser, nothing on servers
- No accounts — no signup, no email, no tracking
- No subscription — free forever
- Works offline once loaded

**Tech:** Vanilla HTML/CSS/JS + IndexedDB. Zero dependencies, ~40KB total. Open index.html directly or serve as static files.

**Why not Caring Village?** $15-25/mo, requires an account, cloud-dependent, complex UI. Clan is free, private, and designed for the 70+ user who finds most apps confusing.

Try it: https://generic007.github.io/clan/
Code: https://github.com/generic007/clan

---

## Reddit Posts

### r/caregiving

**Title:** I built a free, private care coordination app for families — no accounts, no cloud

Every caregiving app I found either wanted $15-25/month, required an account, stored data on their servers, or had a UI my mom couldn't navigate.

So I built Clan — a local-first PWA that tracks medications, appointments, and daily care logs. Everything stays on your device. No account, no subscription, no cloud.

Features:
- 💊 Add medications with dose times, one-tap taken/skipped
- 📅 Appointments with date, time, provider, location
- 📝 Daily log with mood (5 levels), symptoms, meals, notes
- 📋 Dashboard showing today's meds and appointments
- 🌙 Dark mode
- ⬇️ Full JSON export

It's free, it's private, and it works offline. Open the URL, start tracking.

https://generic007.github.io/clan/

### r/dementia

**Title:** A simple, private app for tracking medications and daily care — no accounts, no cost

Caring for someone with dementia means tracking medications, appointments, mood, and daily notes. Most caregiving apps require accounts, cloud storage, and subscriptions — and their UIs are too complex for the person you're caring for to use themselves.

I built Clan as an alternative: a local-first PWA that works entirely on your device.

- Simple medication tracker with dose logging
- Appointment calendar
- Daily care log (mood, symptoms, meals)
- Dashboard with today's overview
- Large text, high contrast — designed for seniors too
- Export data anytime

No account, no subscription, no learning curve. Just open the URL.

https://generic007.github.io/clan/

### r/AgingParents

**Title:** Found a free, no-account-needed app for tracking meds and appointments

Coordinating care for aging parents is a mess of doctor visit notifications, medication schedules, and daily updates between siblings. I've been using a mix of group texts and a shared calendar, but things get lost constantly.

Built a simple PWA that does one thing: track medications, appointments, and daily care logs. Everything stays local on your device. No accounts, no subscriptions.

For anyone in a similar situation: https://generic007.github.io/clan/

### r/privacy

**Title:** I built a care coordination app that doesn't need your data

Most "caregiver" apps require accounts, phone numbers, and cloud storage for your family's medical information. That's a lot of trust to place in a SaaS company.

Clan is different:
- 100% local-first — data stays in IndexedDB on your device
- No servers — nothing leaves your browser
- No accounts, no email, no phone number
- No analytics, no tracking, no cookies
- Open source on GitHub
- Full data export (JSON)

https://generic007.github.io/clan/

---

## Launch Checklist

- [ ] GitHub Pages deployed ✓
- [ ] Hacker News Show HN
- [ ] r/caregiving post
- [ ] r/dementia post
- [ ] r/AgingParents post
- [ ] r/privacy post
- [ ] Register clan domain (clan.care, getclan.app?)
- [ ] SEO landing page with targeted keywords
