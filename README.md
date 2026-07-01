# CourseGrade – Golf Course Review Intelligence App

Production-grade offline-first golf course review system implementing the full 8-screen spec with weighted scoring, Firebase sync, and local persistence.

## Quick Demo (runs immediately)

```bash
cd web-demo
npm install
npm run dev
```

Open **http://localhost:5174** — mobile-first iPhone frame UI with all 8 screens.

### Demo includes on first run
- **Submitted review**: Pebble Beach (8.7, A-, Full Range + Restaurant, Fast Greens / High Difficulty tags)
- **Draft review**: Augusta National (resume from Home)
- **Course search**: offline fallback for Pebble Beach, Augusta, St Andrews + more

### Offline test
1. Open DevTools → Network → Offline
2. Start a review — all fields auto-save to localStorage
3. Refresh page — draft persists
4. Go back online — pending reviews sync automatically

## Architecture

| Layer | Technology |
|-------|------------|
| Mobile UI (demo) | React + Vite, iPhone frame |
| Production mobile | Flutter / FlutterFlow export |
| Backend | Firebase Firestore |
| Offline | IndexedDB (Firestore) + localStorage backup |
| Scoring | Shared engine in `shared/scoring.ts` |
| Places | Google Places API (with offline fallback) |

## 8 Screens

1. **Home** — Start New / Continue Draft / My Reviews
2. **Course Info** — Places search, identity, round details
3. **Scored Categories** — 10 weighted 1–10 sliders, live score
4. **Descriptive Profile** — single-select tags (no score impact)
5. **Amenities** — multi-select arrays
6. **Notes** — optional text fields
7. **Summary** — final score + grade + tags, submit → sync queue
8. **Confirmation** — success + navigation

## Scoring Engine

```
Weighted Score = Σ(category_score × category_weight)
Rounded to 1 decimal place
```

Weights loaded from Firestore `score_config/default` (cached locally). Letter grades A+ through F per spec thresholds.

## Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore
3. Deploy rules: `firebase deploy --only firestore:rules`
4. Import seed: use `firebase/seed-data.json` via console or admin script
5. Copy config to `web-demo/.env`:

```env
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc
VITE_GOOGLE_PLACES_API_KEY=your-places-key
```

Without `.env`, the demo runs in **local-only mode** — all features work, sync marks as submitted locally.

## Flutter / FlutterFlow

See `flutter_app/` for the complete Dart implementation mirroring this spec. Import into FlutterFlow or run directly:

```bash
cd flutter_app
flutter pub get
flutter run
```

## Data Collections

- `reviews` — submitted reviews
- `draft_reviews` — in-progress sync copies
- `score_config` — remote weight configuration
- `sync_status_logs` — sync audit trail
- `users` — optional reviewer metadata

## Acceptance Criteria

| Criteria | Status |
|----------|--------|
| All 8 screens functional | ✅ |
| Offline mode complete | ✅ |
| Auto-save on every field | ✅ |
| Consistent weighted scoring | ✅ |
| Background Firebase sync | ✅ |
| Draft persistence after restart | ✅ |
| Google Places + fallback | ✅ |
| No data loss | ✅ |
| Seeded demo data | ✅ |
| No crash / red error screens | ✅ |
