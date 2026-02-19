# IronPeak Gym – Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Database

Create a `.env` in the project root with:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

(Use your real PostgreSQL user, password, host, and database name.)

## 3. Create tables and seed data

```bash
npm run db:push
npm run db:seed
```

- `db:push` applies the Prisma schema to your database.
- `db:seed` fills it with sample trainers, classes, schedules, members, and bookings.

## 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What works

- **Home** – Contact form (saves to DB).
- **Classes** – List from DB, book a class (guest name/email).
- **Trainers** – List from DB.
- **Schedule** – Static schedule view.
- **Pricing** – Member signup (saves to DB).
- **Dashboard** (`/dashboard`) – Stats, revenue, recent bookings.
- **Members** (`/members`) – List, add, edit, delete members.

If you see “No classes” or “Failed to load”, run `npm run db:push` and `npm run db:seed`, then refresh.
