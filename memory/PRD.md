# BCS Pre K Conference App — PRD

## Original Problem Statement
Mobile-responsive web app (React + FastAPI + MongoDB) for a one-day Pre K educator professional development conference on June 8, 2026 — Birmingham City Schools. Tagline: "Success Starts Here". Attendees scan a QR code and open in any phone browser (no install, no login). Brand colors: Teal #145261, Dark Teal #092936, Gold #F6B829, Maroon #541011, Background #FDFBF7.

## Architecture
- **Backend**: FastAPI + Motor (MongoDB async), all routes under `/api`, health check at `GET /`.
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + sonner toasts. Mobile-first, bottom tab bar.
- **DB**: MongoDB collections — `agenda`, `sessions_data`, `resources`. Seeded on startup if empty.
- **Auth**: PIN-protected admin (default `4321`, configurable via `ADMIN_PIN` env var).

## User Personas
1. **Conference Attendee (Pre K Teacher)** — opens app on phone, navigates agenda, finds their band-color group + rotation schedule, locates rooms, submits feedback.
2. **Event Organizer / Admin** — enters PIN, edits agenda items, sessions, and resource links during/before the event.

## Core Requirements (Static)
- Public browser URL, no login for attendees.
- Mobile viewport 390×844 must look clean.
- 7-step agenda (editable), 4 sessions (alphabetical, editable), 4 resources (editable URLs), 5 hardcoded locations.
- 4 hardcoded groups with fixed rotation matrices (Blue → Green → Red → Yellow order).
- Feedback form does NOT persist — just shows Thank You.
- Admin: PIN unlock → edit agenda/sessions/resources tabs.
- Branding: gold "Success Starts Here" pill with star, BCS logo in hero, TALA sponsor card on Home.

## What's Been Implemented (Feb 2026)
- **Backend** ✅: All CRUD endpoints, PIN verification, seed-on-startup, health check, `_id` excluded.
- **Frontend** ✅: All 9 pages (Home, Agenda, My Group + detail, Sessions, Locations, Resources, Feedback, More, Admin), bottom tab navigation, mobile-responsive layout, distinctive Fraunces + Plus Jakarta Sans typography, brand color system, fade-up entrance animation.
- **Testing** ✅: 100% backend (10/10) and 100% frontend (19/19) per testing_agent_v3 iteration 1.

## P0 (Done)
- ✅ All 9 pages render correct content
- ✅ Group rotation matrices match brief exactly
- ✅ Admin PIN flow works, edits persist
- ✅ MongoDB `_id` excluded everywhere

## P1 / Backlog (Deferred)
- Resource URL inputs for organizer to fill closer to event date
- Optional: persist feedback to DB + admin dashboard summary
- Optional: live "now playing" highlight on Agenda based on current time
- Optional: PWA manifest + offline cache for poor venue Wi-Fi
- Optional: add `Literal` enum validation for AgendaItem.type
- Optional: migrate `@app.on_event` to FastAPI lifespan

## P2
- Custom 404 page
- Speaker bios / photos for keynote
- Analytics on most-clicked tabs

## Test Credentials
- Admin PIN: `4321`
