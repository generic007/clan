# Clan — Family Caregiver Coordination App

> Research Date: 2026-07-01
> Status: Active Build

## Market Size

| Source | 2024/2026 | Forecast | CAGR |
|--------|-----------|----------|------|
| Business Research Insights | $1.26B (2026) | $2.52B (2035) | 8% |
| Verified Market Reports | $3.5B (2024) | $15.2B (2033) | 18.2% |
| QY Research | ~$1.2B (2024) | ~$3.0B (2032) | ~12% |

**Conservative estimate:** $1.2-1.5B market in 2026, growing to $2.5-3.5B by 2032-2035.

## Demographics

### US Family Caregivers
- **53 million** family caregivers in the US (22% of adult population)
- **Average:** 25 hours/week on caregiving
- **25%** of caregivers spend **40+ hours/week** (equivalent to full-time job)
- **65+ smartphone adoption:** 75%+ (2025), growing
- **Sandwich generation:** Adults caring for both children AND aging parents — rapidly growing segment
- **Geographic dispersion:** 1 in 4 caregivers lives 1+ hour away from care recipient

### Key Trends Driving Demand
1. **Boomer aging wave:** 10,000 Americans turn 65 every day through 2027
2. **Distributed families:** Family members rarely live in the same city
3. **Healthcare complexity:** More at-home care, more medications, more specialist visits
4. **Privacy backlash:** Users increasingly refuse cloud-dependent health apps
5. **Subscription fatigue:** Users want tools that don't require ongoing payments

## Competitive Landscape

### Direct Competitors

| App | Focus | Price | Platforms | Gaps |
|-----|-------|-------|-----------|------|
| **Caring Village** | All-in-one coordination | $15-25/mo | Web, iOS, Android | Cloud-only, account required, complex UI, expensive for basic needs |
| **Medisafe** | Medication reminders only | Free/$5/mo | iOS, Android | Meds-only, no coordination, text-free, bug reports |
| **CaringBridge** | Health journey updates | Free (nonprofit) | Web, iOS, Android | Updates-only, no tasks, no meds, no docs |
| **ianacare** | Task delegation + support | Varies (employer/plan) | Web, iOS, Android | Access gated by employer, fragmented features |
| **Life360** | Location tracking | Free/$15/mo | iOS, Android | Location-only, not caregiving, privacy concerns |
| **Cozi** | Family organizer | Free/$5/mo | Web, iOS, Android | Not health-privacy, not care-specific |
| **Lotsa Helping Hands** | Volunteer task sign-ups | Free | Web, iOS, Android | Community-only, no health records |
| **MyTherapy** | Meds + health diary | Free | iOS, Android | Personal tracker, no family coordination |

### 🚩 CareZone/Walmart Wellness — RETIRED (Jan 2023)
- Former leader in family care coordination exited the market
- Left thousands of caregivers looking for replacement
- Validates both the demand AND the difficulty of the space

### The Gap

**No app occupies this intersection:**

```
✅ Family care coordination (meds + appointments + tasks + updates)
✅ 100% local-first (data stays on devices, no cloud dependency)
✅ No accounts required for core features
✅ Designed for seniors (large text, simple navigation, voice input)
✅ PWA (works on any device, no install)
✅ Private by architecture (encrypted sharing, zero-trust)
✅ Free core (pay only for optional sync/collaboration)
✅ Simple enough for non-technical families
```

## Identified User Pain Points

### From Reviews & Communities

1. **"Too many apps"** — Families need 2-3 apps to cover meds, schedule, and updates
2. **"My mom can't use it"** — Existing UIs are too complex for 70+ users
3. **"I don't want my family's health data on someone's server"** — Privacy concerns with cloud apps
4. **"$15-25/mo for something so basic?"** — Price resistance for simple calendar + checkbox features
5. **"My sister lives in another state and can't help with the app"** — Long-distance caregivers struggle with sync/collaboration
6. **"I spend more time updating the app than caregiving"** — Too much data entry, not enough value
7. **"Every sibling has a different phone"** — Cross-platform is essential
8. **"Why do I need an account just to see my dad's med schedule?"** — Account friction for simple sharing

### The Core Problem

**Caregiving coordination is information chaos disguised as logistics.** Families juggle:
- Group texts (important details get lost in scroll)
- Spreadsheets (not mobile-friendly, not real-time)
- Sticky notes (lost, outdated, no backup)
- Memory (exhausting, error-prone)

None of these work for distributed families with multiple caregivers.

## The "Clan" Positioning

**Clan is the family care hub that just works — no accounts, no cloud, no complexity.**

You don't sign up. You don't pay. You don't learn a new system. You open a URL, see today's med schedule, appointments, and what the other caregivers logged. Everything lives on your devices. If you want to share with family, send them a secure link — no account needed.

### Tagline (Exploring)

- "Family care, organized. Private by default."
- "The care hub that respects your family's privacy."
- "No accounts. No subscriptions. Just care coordination that works."
- "Because your mom's health records shouldn't be a subscription."

### Target Users

**Primary: The Sandwich Generation Caregiver (35-55)**
- Has elderly parents + school-age kids
- Technology-proficient but overwhelmed
- Values privacy, hates subscriptions
- Likely reading HN, r/privacy, r/caregiving

**Secondary: The Long-Distance Caregiver**
- Lives in different state/city
- Needs shared view of appointments, meds, daily status
- Frustrated with phone tag with siblings

**Tertiary: The Senior Care Recipient (65+)**
- Needs a simple daily view of their schedule
- Large text, one-button check-in, minimal navigation
- May use an iPad/Samsung tablet dedicated to the app

## Monetization

### Free Forever (Core)
- Full local-first PWA
- No accounts, no signup
- Medication tracking & reminders
- Appointment calendar
- Care log / daily notes
- Photo storage for meds/documents

### Premium (Optional, ~$5/mo or $50/yr)
- Encrypted family sync between devices
- Secure sharing link for distant family
- Export/Backup to encrypted archive
- Photo confirmation of meds taken
- PDF care summary for doctor visits

### Why Free Core?
- Privacy-first means no data collection = no ad revenue
- Free core drives adoption (the hard part is getting families to use any tool)
- Premium sync is the value-add (the real pain is family coordination)
- Zero marginal cost for local-first architecture

## MVP Feature Set (Phase 1)

### Must Have (Launch)
1. **Daily Dashboard** — Today's meds, appointments, tasks at a glance
2. **Medication Tracker** — Name, dose, schedule, photo of bottle, taken/skipped log
3. **Appointment Calendar** — Upcoming appointments, alerts
4. **Care Log** — Daily notes: mood, symptoms, meals, incidents
5. **Simple UI** — Large text, high contrast, minimal taps
6. **100% Local-First** — IndexedDB storage, zero servers
7. **PWA** — Offline-capable, installable, any device

### Phase 2 (Post-Launch)
1. **Family Sync** — Encrypted P2P or relay-based sharing
2. **Secure Share Links** — Password-protected view for family
3. **Photo Med Confirmation** — Photo evidence of pills taken
4. **PDF Doctor Summary** — Export care log for appointments
5. **Voice Input** — Dictate daily notes
6. **Emergency Contact Card** — One-tap emergency info

### Phase 3
1. **Family Chat** — Encrypted messaging tied to care log
2. **Medication Interaction Checker** — Flag dangerous combos
3. **Appointment Reminders via SMS/Email** (opt-in, no account needed)
4. **Telehealth Link Integration**
5. **Printable Care Plan** — One-page summary for wall/fridge

## Tech Stack

- **Vanilla HTML/CSS/JS** (same approach as Liner — zero dependencies)
- **IndexedDB** for local storage
- **Service Worker** for offline support
- **PWA manifest** for installability
- **Web Crypto API** for encryption (Phase 2)
- **No backend** — zero server costs, infinite scale

## Build Plan

### Today (July 1)
- [ ] Research & positioning document (this file)
- [ ] Scaffold project structure
- [ ] Build core HTML/CSS shell
- [ ] Build med tracker
- [ ] Build appointment calendar
- [ ] Build care log
- [ ] Build daily dashboard

### Week 1
- [ ] Polish UI for seniors (large text, high contrast)
- [ ] PWA manifest + service worker
- [ ] Offline testing
- [ ] Beta test internally

### Week 2
- [ ] GitHub Pages deployment
- [ ] HN Show HN post
- [ ] Reddit posts (r/caregiving, r/dementia, r/AgingParents, r/privacy)

### Week 3+
- [ ] Family sync (Phase 2)
- [ ] Premium features
- [ ] Iterate based on feedback

---

## Why "Clan"?

- Short, memorable (4 letters)
- Evokes family/tribe — the caregiving village
- Domain short enough to find alternatives
- Not medical-sounding (less intimidating)
- Works for both the family and the care recipient

## Domain Options

| Domain | Available | Notes |
|--------|-----------|-------|
| clan.app | ❌ Likely taken | Premium domain |
| getclan.app | ? | Worth checking |
| theclan.app | ? | Worth checking |
| clan.care | ? | Perfect but expensive |
| myclan.app | ? | Solid option |

---

### Sources
- Business Research Insights: Caregiver App Market 2026
- Verified Market Reports: Caregiver App Market 2024-2033
- CaringVillage: 11 Best Caregiver Apps for Families (2026)
- Caregiver Action Network: Caregiver Statistics
- Caregiver.org: Caregiving in the US 2025
- AARP / National Alliance for Caregiving: Caregiving in the US
