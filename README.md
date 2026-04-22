# Symphony

## Project Overview
Symphony is an AI-powered playlist generation and curation engine. The system utilizes multi-agent LLM pipelines to interpret natural language intent, extract track metadata from images, and interface with the Spotify Web API to construct and remix playlists. The architecture focuses on bypassing traditional API read restrictions through vision-based extraction and implementing a robust, state-managed curation workflow.

## Architecture and Pipeline Design
The system is built on a modular architecture that separates intent parsing, track discovery, and platform integration.

### Prompt to Playlist Pipeline
The primary generation workflow follows a 6-stage execution model:
1. **Intent Parsing**: The system utilizes Gemini 2.5 Flash or Groq to extract mood, era, genre, tempo, and thematic constraints from the user prompt into a structured schema.
2. **Seed Generation**: A LangGraph state machine generates 25 initial track seeds. This stage includes an evaluation node that verifies the quantity and relevance of the draft tracks before progression.
3. **Last.fm Expansion**: The seeds are expanded using the Last.fm API to discover similar tracks. The system calculates a combined score based on Last.fm similarity and AI confidence to identify high-quality candidates.
4. **Curation**: An AI agent selects the optimal tracks and orders them for listening flow, ensuring no consecutive tracks by the same artist and adhering to the target track count.
5. **Spotify Search**: The system implements a 7-pass waterfall search algorithm to resolve track metadata to Spotify URIs, handling variations in titles and artist formatting.
6. **Playlist Creation**: The final tracklist is pushed to the Spotify Web API to generate a persistent playlist.

### Screenshot to Playlist Pipeline
The vision pipeline utilizes Gemini 2.5 Flash to process UI screenshots of existing playlists. The system extracts track titles and artist names directly from the image data, bypassing Spotify API read-private restrictions. The extracted metadata is then injected into the standard resolution and creation pipeline.

### Remix Pipeline
The remixing engine employs a LangGraph-powered evaluation agent. The system ingests an existing Spotify playlist, filters tracks against natural language constraints provided by the user, and outputs a curated subset. The state machine includes iterative feedback loops to ensure the remixed selection matches the requested constraints.

## Authentication Flow
The system implements a dual-token architecture to manage Spotify API interactions and mitigate platform restrictions.

### Dual-Token Architecture
1. **User-Level PKCE**: The client-side application utilizes the OAuth 2.0 PKCE flow to obtain user-level access tokens. These tokens are stored in the database and utilized for read operations on the user's private playlists, enabling access to tracklists that would otherwise be protected by scraping restrictions.
2. **Master Account Token**: The server maintains a persistent Authorization Code flow for a system-level Master Account. This account handles the creation of new playlists and the population of tracks. This separation ensures that the system can generate and host playlists reliably regardless of the individual user's account type or status.

## Environment Variables
The following environment variables are required for local operation.

### Server Configuration (`server/.env`)
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

# Google OAuth (Optional for User Auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Client Configuration (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

## Local Development Setup Instructions
The following steps are required to initialize the development environment.

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Spotify Developer Account
- Google Cloud Console Project (for OAuth)

### Execution Steps
1. **Database Initialization**: Navigate to the server directory and run Prisma migrations.
   ```bash
   cd server
   npm install
   npx prisma migrate dev
   ```
2. **Server Execution**: Start the backend Express server.
   ```bash
   npm run dev
   ```
3. **Master Authentication**: Authenticate the master Spotify account by visiting `http://127.0.0.1:5000/api/auth/login`. This step is mandatory for playlist creation.
4. **Client Execution**: Navigate to the client directory and start the Next.js development server.
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Known API Constraints
The following technical constraints are present due to external API limitations:
1. **Spotify Development Mode**: Applications in development mode are limited to 25 specific allow-listed users.
2. **Spotify 2026 Restrictions**: Recent updates to the Spotify API restrict the ability to fetch playlist data for certain accounts. The system utilizes the user-level PKCE token and Gemini Vision extraction as workarounds for these limitations.
3. **Rate Limiting**: The Spotify Search API is subject to rate limits. The system implements a 200ms sequential delay between search requests to prevent 429 status codes.
4. **Context Window**: Extremely large playlists (300+ tracks) may exceed the context window of certain AI providers during the Remix flow. Gemini 2.5 Flash is recommended for large-scale playlist processing.
