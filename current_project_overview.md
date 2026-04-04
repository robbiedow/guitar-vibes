# ToneBoard

A personal guitar amp preset builder for the **Fender Mustang Micro Plus** portable amplifier. Web-based PWA that lets users design and save tone presets by selecting amp models and effects pedals in a visual signal chain.

## What it does

- Browse and select from 25+ Fender amp models (tweed, blackface, modern high-gain, etc.)
- Organize effects across 4 categories: stompbox, modulation, delay, reverb
- Visualize the signal chain: input → pre-amp effects → amp → post-amp effects → output
- Save/edit/delete presets with optional song metadata (song name, artist, notes)
- PWA with offline support and home screen installation
- GitHub OAuth access control (whitelisted users only)

## Tech stack

- **Framework**: Next.js 15, React 19, TypeScript 5.8
- **Styling**: Tailwind CSS 4, skeuomorphic design with CSS variables
- **Auth**: NextAuth.js v5 beta with GitHub OAuth
- **Storage**: Browser localStorage (no database)
- **Fonts**: Bebas Neue (headings), Outfit (body), Space Mono (labels/tech UI)
- **Icons**: Lucide React

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm start        # Start production server
```

No test or lint scripts are configured.

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Main app — all views (library, editor, pickers)
│   ├── login/page.tsx           # GitHub OAuth login page
│   ├── layout.tsx               # Root layout + PWA metadata
│   ├── globals.css              # Theme variables, animations, global styles
│   └── api/auth/[...nextauth]/  # NextAuth API route
├── components/
│   ├── SignalChain.tsx           # Interactive signal chain visualization
│   ├── PedalCard.tsx            # Skeuomorphic pedal effect component
│   ├── AmpCard.tsx              # Skeuomorphic amp head component
│   ├── AuthProvider.tsx         # NextAuth session provider
│   └── register-sw.tsx          # Service worker registration
├── lib/
│   ├── data.ts                  # Static data (amp models, effects, colors)
│   └── store.ts                 # localStorage persistence layer
├── auth.ts                      # NextAuth config + GitHub provider
└── middleware.ts                # Auth protection middleware
```

## Architecture

- **Single-page app**: All navigation via React state (`View` union type: library, editor, amp-picker, effect-picker). No client-side routing.
- **Client components**: All interactive UI uses `"use client"`. Server components for layout and login only.
- **No backend API**: Presets live entirely in localStorage. Only server route is auth.
- **Signal chain order**: Pre-amp (stompbox, modulation) → Amp → Post-amp (delay, reverb)
- **Mobile-first**: Designed for portrait phone use, uses `100dvh` for full viewport.

## Data model

```typescript
Preset {
  id: string
  name: string
  ampModel: string           // required
  effects: {
    stompbox: string | null
    modulation: string | null
    delay: string | null
    reverb: string | null
  }
  songName?: string
  artistName?: string
  notes?: string
  createdAt / updatedAt: number
}
```

## Design conventions

- Amp model is required; all effects are optional
- Effects are color-coded by category (orange, purple, blue, green)
- Amp families (tweed, British, modern) render with different cabinet colors
- Preset auto-names as "{songName} — {ampModel}" or just amp model if unnamed
- Skeuomorphic 3D cards with gradients, shadows, and amber LED indicators

## Deployment

Target: Vercel. Requires env vars for GitHub OAuth credentials + `AUTH_SECRET` + `ALLOWED_GITHUB_ID`.
