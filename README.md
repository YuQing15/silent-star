# Luminary — Premium Web Novel Translation Platform

A cinematic, binge-worthy web novel reading platform for translated Chinese & Korean fiction. Built with Next.js 15, TypeScript, and Tailwind CSS.

---

## Quick Start (3 commands)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18.17+ |
| npm | 9+ |

Check yours: `node -v && npm -v`

---

## Full Setup

### 1. Clone or download

**GitHub:**
```bash
git clone https://github.com/yourname/luminary.git
cd luminary
```

**Download ZIP:**  
Click the download button above the chat → extract to any folder → `cd luminary`

### 2. Environment variables

```bash
cp .env.example frontend/.env.local
```

The frontend runs fully on mock data — no real env vars needed for local dev.

### 3. Install & run

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, trending, genres, continue reading |
| `/novels` | Browse all novels with filters + sort |
| `/novels/[slug]` | Novel detail — cover, synopsis, chapters list, ratings |
| `/novels/[slug]/chapters/[id]` | **Immersive chapter reader** |
| `/search` | Full-text search with live results |
| `/library` | Reading progress, bookmarks, streak tracker |
| `/profile` | User profile, achievements, stats |
| `/not-found` | 404 page |

---

## Reader Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `↓` | Next chapter |
| `←` / `↑` | Previous chapter |
| `S` | Toggle settings panel |
| `T` | Toggle table of contents |
| `Esc` | Close panels |

---

## Project Structure

```
luminary/
├── frontend/                    # Next.js 15 App
│   ├── app/                     # App Router pages
│   │   ├── layout.tsx           # Root layout (fonts, theme, nav)
│   │   ├── page.tsx             # Homepage
│   │   ├── not-found.tsx        # 404 page
│   │   ├── error.tsx            # Error boundary
│   │   ├── novels/
│   │   │   ├── page.tsx         # Browse novels
│   │   │   └── [slug]/
│   │   │       ├── page.tsx     # Novel detail
│   │   │       └── chapters/
│   │   │           └── [chapterId]/
│   │   │               └── page.tsx  # Chapter reader
│   │   ├── search/page.tsx      # Search
│   │   ├── library/page.tsx     # Library
│   │   └── profile/page.tsx     # Profile
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx  # Cinematic hero carousel
│   │   │   └── HomeSections.tsx # Trending, genres, continue reading
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Top nav + search modal
│   │   │   ├── MobileBottomNav.tsx  # Mobile bottom tabs
│   │   │   └── ThemeProvider.tsx    # Dark/light mode context
│   │   ├── novel/
│   │   │   ├── NovelCard.tsx    # Card (default/horizontal/compact)
│   │   │   ├── NovelBrowseClient.tsx  # Browse page with filters
│   │   │   ├── ChaptersList.tsx # Expandable chapter list
│   │   │   ├── RatingWidget.tsx # Interactive star rating
│   │   │   ├── SearchClient.tsx # Search UI
│   │   │   ├── LibraryClient.tsx    # Library tabs + streak
│   │   │   └── ProfileClient.tsx    # Profile page
│   │   ├── reader/
│   │   │   ├── ReaderClient.tsx     # Full immersive reader
│   │   │   ├── TableOfContents.tsx  # Side TOC panel
│   │   │   └── ReaderComments.tsx   # Chapter comments
│   │   └── ui/
│   │       └── Skeleton.tsx     # Loading skeleton components
│   │
│   ├── hooks/
│   │   └── useReadingProgress.ts  # Scroll progress hook
│   ├── stores/
│   │   └── readerStore.ts       # Zustand: reader prefs + session
│   ├── lib/
│   │   ├── mock-data.ts         # All novel/chapter/comment data
│   │   └── utils.ts             # cn(), formatNumber(), formatDate()
│   ├── styles/
│   │   └── globals.css          # CSS variables, design system
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                     # FastAPI Python (scaffold)
│   ├── main.py
│   └── app/
│       ├── core/config.py
│       └── routers/novels.py
│
├── database/
│   ├── schema.sql               # Full PostgreSQL schema
│   └── prisma.schema            # Prisma ORM schema
│
├── .env.example
└── README.md
```

---

## Running on Replit

1. Go to **replit.com** → **Create Repl** → **Import from GitHub** (paste your repo URL)  
   *or* click **Upload** and drag the project ZIP

2. Replit auto-detects Node.js. If not, set the run command manually:

```
cd frontend && npm install && npm run dev -- --port 3000 --hostname 0.0.0.0
```

3. In **Secrets** (the lock icon), add:
```
NEXT_PUBLIC_APP_URL = https://your-repl-url.replit.dev
```

4. Click **Run** — Replit opens the app in the preview pane.

> **Important:** Change `npm run dev` to `npm run build && npm start` for production mode on Replit.

---

## Running on GitHub Codespaces

1. Push to GitHub, then click **Code → Codespaces → Create codespace**

2. In the terminal:
```bash
cd frontend
npm install
npm run dev
```

3. Codespaces auto-forwards port 3000 — click **Open in Browser** in the Ports tab.

4. To keep it persistent, add a `.devcontainer/devcontainer.json`:
```json
{
  "postCreateCommand": "cd frontend && npm install",
  "forwardPorts": [3000]
}
```

---

## Running the Backend (Optional)

The frontend currently uses mock data and works standalone. To connect the real FastAPI backend:

### Prerequisites
- Python 3.11+
- PostgreSQL 14+

### Setup
```bash
# Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb luminary
psql luminary < ../database/schema.sql

# Copy and fill env vars
cp ../.env.example .env
# Edit .env with your DATABASE_URL, SUPABASE keys, etc.

# Run
uvicorn main:app --reload --port 8000
```

API docs available at **http://localhost:8000/api/docs**

---

## Building for Production

```bash
cd frontend
npm run build
npm start
```

Or deploy to **Vercel** (recommended):

```bash
npm i -g vercel
cd frontend
vercel
```

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router, React 19)
- TypeScript
- Tailwind CSS 3
- Zustand (state)
- Lucide React (icons)
- `use-debounce` (search)
- Google Fonts (Cormorant Garamond, DM Sans, Lora)

**Backend** *(scaffold — not required for local dev)*
- FastAPI (Python)
- PostgreSQL + Prisma ORM
- Supabase (Auth + Storage)

---

## Design System

- **Dark mode by default** — switches via `ThemeProvider`
- **CSS variables** for all colors — see `styles/globals.css`
- **Reader themes**: Light, Sepia, Dark, Forest, Ocean
- **Typography**: Display (Cormorant), UI (DM Sans), Reading (Lora)
- **Animations**: fade-up, scale-in, shimmer via Tailwind keyframes
