# GE Scout

An OSRS Grand Exchange flipping analytics portfolio project. The starter app uses Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

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

The app runs at [http://localhost:3000](http://localhost:3000), and the starter API is available at `GET /api/items`.

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

- `src/app/page.tsx`: dashboard screen and temporary presentation data
- `src/app/api/items/route.ts`: server endpoint for market items
- `src/lib/db.ts`: shared Prisma client
- `prisma/schema.prisma`: SQLite data model
- `prisma/seed.ts`: local development data

## Suggested next steps

1. Move the dashboard table to fetch from `/api/items`.
2. Add a `PriceSnapshot` model so each item has price history.
3. Build a scheduled importer for the OSRS Wiki price API.
4. Add filters for minimum margin, ROI, volume, and available cash.
5. Add authentication and a personal watchlist.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
