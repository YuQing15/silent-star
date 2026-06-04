# Silent Star

A web novel reading platform focused on translated Chinese and Korean fiction.

Silent Star focuses on a clean and comfortable reading experience, allowing readers to browse novels, track reading progress, bookmark chapters, and continue reading across devices.

Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

---

## Live Demo

https://silent-star-zeta.vercel.app

## Features

### Reading Experience

- Custom chapter reader
- Adjustable font size
- Adjustable line height
- Mobile and desktop reading layouts
- Adjustable reading width for desktop readers
- Multiple reading themes:
  - Light
  - Sepia
  - Dark
  - Snow
  - Starry
- Reading progress tracking
- Automatic chapter completion tracking
- Continue Reading support

### Novel Management

- Browse published novels
- Novel detail pages
- Chapter navigation
- Reading status management:
  - Currently Reading
  - Want to Read
  - Completed
  - Dropped
- Bookmarks and reading history

### Admin Tools

- Admin dashboard
- Novel management
- Chapter management
- Draft and published chapter support
- Origin language selection
- Admin guide popup

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Zustand

### Backend & Database

- Supabase
  - PostgreSQL Database
  - Storage

- FastAPI (backend scaffold)

---

## Getting Started

### Requirements

| Tool | Version |
|--------|---------|
| Node.js | 18+ |
| npm | 9+ |

Check your versions:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YuQing15/silent-star.git
cd silent-star
```

Install dependencies:

```bash
cd frontend
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

Create a file called:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PREVIEW_PASSWORD=your_password
```

---

## Project Structure

```text
silent-star/
├── frontend/
├── backend/
├── database/
└── README.md
```

### Frontend

```text
frontend/
├── app/
├── components/
├── hooks/
├── lib/
├── stores/
├── styles/
└── supabase/
```

### Backend

```text
backend/
└── FastAPI scaffold
```

### Database

```text
database/
└── PostgreSQL / Supabase schema
```

---

## Main Pages

| Route | Description |
|---------|-------------|
| `/` | Home page |
| `/browse` | Browse all novels |
| `/novels/[id]` | Novel details |
| `/novels/[id]/chapters/[chapterId]` | Chapter reader |
| `/profile` | Reader dashboard |
| `/admin` | Admin desk |

---

## Reader Features

### Reading Layouts

- Mobile / Narrow
- Desktop / Wide
- Adjustable content width

### Fonts

- Serif
- Sans
- Literata

### Themes

- Light
- Sepia
- Dark
- Snow
- Starry

### Progress Tracking

- Automatic progress saving
- Continue Reading support
- Chapter completion tracking
- Bookmark support

---

## Deployment

Silent Star is configured for deployment on Vercel.

### Build

```bash
cd frontend
npm run build
```

### Vercel Settings

```text
Framework Preset: Next.js
Root Directory: frontend
```

Push changes to GitHub and connect the repository to Vercel.

---

## Planned Improvements

- Add more novels and chapters
- Improve novel discovery and filtering
- Expand reader customisation options
- Improve admin publishing workflow
- Add optional translation assistance tools

---

## About

Silent Star is a personal project built around my interest in translated web novels.

The goal was to create a reading experience that feels cleaner and more comfortable than many existing aggregator sites, while providing useful reader features such as progress tracking, custom themes, adjustable layouts, and chapter management tools.

The project is currently used as a platform for hosting and reading translated Chinese and Korean fiction.
