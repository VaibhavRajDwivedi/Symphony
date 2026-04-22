# Symphony — AI-Powered Spotify Playlist Engine

> Transform screenshots, natural language prompts, or existing playlists into perfectly curated Spotify playlists using a multi-stage AI pipeline.

---

## What is Symphony?

Symphony is a full-stack, production-grade music utility that removes the friction between "I want to listen to something" and "I have a playlist playing." It uses Google Gemini's multimodal AI, a 6-stage curation pipeline, and the Spotify Web API to generate, remix, and manage playlists from three distinct inputs:

- **A screenshot** of any music queue (Spotify, Apple Music, YouTube, anything)
- **A natural language prompt** describing a mood, era, or vibe
- **An existing Spotify playlist URL** to filter or reorder

---

## Live Demo

> `http://127.0.0.1:3000` (local) · `/app` for the generator · `/` for the landing page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Zustand, TailwindCSS |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| AI | Google Gemini 2.5 Flash (text + vision) |
| Music Graph | Last.fm API |
| Platform | Spotify Web API (OAuth 2.0 + PKCE) |
| Auth | Google OAuth 2.0 (JWT + cookies) |
| Realtime | Server-Sent Events (SSE) |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                    │
│   Landing Page  ·  App  ·  Sidebar  ·  Chat History         │
│   SSE Hooks  ·  PKCE Auth  ·  Zustand State                 │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / SSE
┌────────────────────────────▼────────────────────────────────┐
│                      SERVER (Express)                       │
│   /api/stream/generate   /api/stream/recommend              │  
│   /api/auth/google       /api/chats                         │
│   /api/auth/login (master)                                  │
└──────┬──────────────┬──────────────┬───────────────┬────────┘
       │              │              │               │
  ┌────▼────┐   ┌─────▼─────┐ ┌────▼────┐   ┌─────▼──────┐
  │ Gemini  │   │  Last.fm  │ │Spotify  │   │ PostgreSQL │
  │  2.5    │   │    API    │ │Web API  │   │   Prisma   │
  └─────────┘   └───────────┘ └─────────┘   └────────────┘
```

### Dual-Token Architecture

Symphony uses two separate Spotify tokens to work around platform restrictions:

```
Master Account Token (server-side, persistent)
  → Creates playlists on the Symphony master account
  → Handles all write operations for anonymous/preview flows
  → Auto-refreshes via stored refresh token in DB (SpotifyToken model)

User PKCE Token (client-side → server-side storage)
  → Obtained via frontend PKCE flow
  → Used for read operations on the user's private playlists (Remix flow)
  → Stored in the User model (spotifyAccessToken) to enable the "Save to Account" feature
```

---

## AI Pipelines

### Pipeline 1 — Screenshot to Playlist

```
User uploads screenshot
  └─► Gemini Vision extracts track list from image
        └─► 7-pass Spotify waterfall search resolves URIs
              └─► Playlist created on master account
                    └─► SSE streams status updates to client
                          └─► Embedded player + result shown
```

Gemini reads any screenshot — Spotify queue, Apple Music, YouTube, a photo of a setlist. Vision model handles it natively with no OCR libraries required.

### Pipeline 2 — Prompt to Playlist (6-Stage)

```
Stage 1 │ Intent Parser    → Extracts mood, era, genre, tempo, themes
Stage 2 │ Seed Generator   → Gemini generates 25 specific track seeds via LangGraph
Stage 3 │ Last.fm Expand   → Finds similar tracks, scores by similarity
Stage 4 │ AI Curator       → Selects best candidates, orders for flow
Stage 5 │ Spotify Search   → 7-pass waterfall resolves each track to URI
Stage 6 │ Playlist Create  → Pushes to Spotify, returns shareable URL
```

**What makes Stage 4 different:** The curator enforces variety, builds an energy arc, and ensures listening flow across the generated selection.

### Pipeline 3 — Remix

```
User pastes an existing Spotify playlist URL + a remix prompt
  └─► Fetcher retrieves tracks from the source playlist
        └─► LangGraph Remix Agent analyzes tracks against prompt
              └─► Evaluator node ensures output matches constraints
                    └─► New curated subset created as a new playlist
```

---

## Features

### Core
- **Screenshot → Playlist** — drop any tracklist image, get a Spotify playlist in seconds
- **Prompt → Playlist** — describe your vibe in plain English, AI does the rest
- **Remix** — filter and reorder existing Spotify playlists with natural language
- **Live SSE streaming** — real-time status updates during generation
- **Vibe Check** — AI generates an analysis of the playlist vibe
- **Playlist DNA** — estimated mood and energy scores

### Saving & Sharing
- **24-hour preview** — playlists auto-delete after 24 hours from the master account
- **Save to your Spotify** — One-click clone to the user's own Spotify library
- **Auto-cleanup cron** — Periodic job deletes expired playlists from Spotify + DB

---

## Search Algorithm — 7-Pass Waterfall

Every track goes through up to 7 search attempts before being marked as not found:

1. **Strict quoted**: `track:"Title" artist:"Artist"`
2. **Clean unquoted**: `CleanTitle CleanArtist`
3. **Raw original**: Full title + all artists
4. **First artist**: Full title + first artist only
5. **Title only**: CleanTitle (broader net)
6. **Strip subtitle**: "Happy - From Despicable Me 2" → "Happy Artist"
7. **Base title**: Last resort, title only

---



## Setup & Installation

### Prerequisites

- Node.js v18+
- PostgreSQL
- Spotify Developer account
- Google Cloud Console project (for Google Login)
- Gemini API Key (Google AI Studio)
- Last.fm API Key

### 1. Clone & Install

```bash
git clone https://github.com/VaibhavRajDwivedi/Symphony.git

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://127.0.0.1:3000
JWT_SECRET=your_jwt_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/symphony

# AI Configuration
AI_PROVIDER=gemini # or groq
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Spotify
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/api/auth/callback
SPOTIFY_MASTER_USER_ID=your_spotify_user_id

# Last.fm
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_SHARED_SECRET=your_lastfm_shared_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**`client/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

### 3. Database & Auth Setup

1. Run `npx prisma db push` in the server directory.
2. In the Spotify Dashboard, add the Redirect URIs specified in the `.env` files.
3. Authenticate the Master Account by visiting `http://127.0.0.1:5000/api/auth/login`.

---

## Known Constraints

### Spotify Development Mode
Apps are limited to **25 allow-listed users**. Add testers manually via the Spotify Dashboard.

### API Changes
The system uses the latest Spotify endpoints (`/playlists/{id}/items`) and utilizes Vision AI to bypass platform read restrictions on private queues.

### Rate Limits
Spotify Search is subject to rate limits. The system implements sequential search with built-in delays to mitigate 429 errors.

---

## License
MIT — built as a portfolio project. Not affiliated with Spotify or Google.