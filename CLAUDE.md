# flipBird

Social review app for license plates. Scan a plate, rate the driver 0-5 stars, tag with emoji labels, leave notes. Plate owners can claim their plate to see their reputation.

## Stack

- **Expo SDK 54** (React Native, expo-router v4 for file-based routing)
- **Supabase** — Postgres + Auth + RLS (project: buypfewnykwmqipxzssa)
- **PlateRecognizer API** — license plate OCR (falls back to mock mode without key)

## Running the app

```bash
npm install --legacy-peer-deps
npm start -- --clear
```

Use Expo Go on phone (scan QR) or press `i` for iOS simulator (requires Xcode).

## Environment

Copy `.env.example` to `.env` — Supabase credentials are already configured locally.

## Current status (as of last session)

- Full app scaffold complete and pushed to `main` on `franklyLost/flipBird`
- Supabase project created, schema SQL has been run
- Working through local dev environment setup issues:
  - SDK upgraded from 51 → 54
  - Removed `react-native-reanimated` (not used, caused babel plugin conflict)
  - `babel.config.js` should only have `babel-preset-expo`, no plugins
  - Assets folder created with placeholder PNGs
  - Use `--legacy-peer-deps` for npm installs
  - Run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` if Xcode not detected

## Architecture

```
app/                    Expo Router screens
  (tabs)/
    index.tsx           Home — scan button + manual plate/state search
    profile.tsx         My claimed plates + reviews given
  _layout.tsx           Root stack navigator
  auth.tsx              Sign in / sign up (modal)
  camera.tsx            Live camera + plate OCR (demo mode without API key)
  plate/[id].tsx        Plate detail page + reviews list
  rate/[id].tsx         Rate a driver — stars + tags + note (modal)
  claim/[id].tsx        Claim plate ownership (modal)

components/
  StarRating.tsx        0-5 star selector/display
  TagSelector.tsx       Emoji tag picker grouped by positive/negative/neutral
  PlateCard.tsx         License plate display card with rating stats
  ReviewCard.tsx        Single review display

lib/
  supabase.ts           Supabase client
  plateRecognizer.ts    PlateRecognizer API + mock fallback
  plates.ts             All data access functions

types/index.ts          TypeScript types + TAGS constant (14 emoji tags)
supabase/schema.sql     Full DB schema (already applied to Supabase project)
```

## Tags

14 emoji tags: good_driver, courteous, safe, polite (positive) / speeder, ran_red, on_phone, cut_off, road_rage, tailgating, bad_parking, dangerous (negative) / broken_light, loud_music (neutral)

## Key decisions

- **No custom backend** — mobile app talks directly to Supabase via RLS policies
- **Plate ownership** — claims are pending by default; two people claiming same plate auto-flags as conflicted
- **Anonymous reviews** — username hidden publicly but stored internally for moderation
- **Demo mode** — camera returns mock plate `7ABC123 CA` when no PlateRecognizer key set
