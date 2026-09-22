# GE Scout

An OSRS Grand Exchange flipping analytics dashboard with live market prices and six-hour price history charts.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS v4 through the PostCSS plugin
- Prisma ORM with SQLite
- RuneScape Wiki real-time prices API

Tailwind is available throughout the app through `src/app/globals.css`. Keep reusable styling in the global stylesheet and use Tailwind utilities for component-level styling as the UI grows.

## Getting Started

Install and initialize the local database:

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

When the Prisma schema changes, create a named migration with:

```bash
npm run db:migrate -- --name describe-your-change
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app runs at [http://localhost:3000](http://localhost:3000). The API endpoints are:

- `GET /api/items`: live item prices and estimated daily volume
- `GET /api/items/:id`: six-hour price history for an item

## Run with Docker

Install and start Docker Desktop, then run:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The container creates the SQLite database, applies the Prisma schema, and seeds the sample items on startup. Stop it with `Ctrl+C`, or run `docker compose down` from another terminal.

The database is stored in the `osrs_data` Docker volume. To delete the database and seed it from scratch:

```bash
docker compose down -v
```

## Project map

- `src/app/page.tsx`: dashboard screen and live price graph
- `src/app/api/items/route.ts`: server endpoint for live market items
- `src/app/api/items/[id]/route.ts`: server endpoint for item price history
- `src/lib/db.ts`: shared Prisma client
- `prisma/schema.prisma`: SQLite data model
- `prisma/seed.ts`: local development data
