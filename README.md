# Classroom Slot Booking System

A modern classroom reservation platform built with [Next.js](https://nextjs.org), Prisma, and a sleek glassmorphism UI.

## Features

- 📋 **Dashboard** — live stats on total rooms, available rooms, and bookings
- 🏫 **Rooms** — browse all classrooms with capacity, amenities, and floor details
- 📅 **Book** — reserve a room for a specific date and time slot
- 🗓️ **Schedule** — view the full booking schedule
- 🔖 **My Bookings** — manage your personal reservations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database ORM**: Prisma
- **Styling**: Custom CSS (glassmorphism / crystal design)
- **Language**: TypeScript

## Recent Changes

- Added floor number display in `RoomCard` component
- Added hover tooltip (`title`) on room cards for accessibility
