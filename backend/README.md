# Task SaaS Backend

This package contains the Express API, PostgreSQL configuration, Sequelize models, and JWT authentication used by the Task SaaS app.

For full setup, environment, and deployment instructions, see the root [README](../README.md).

## Quick Start

1. Copy `.env.example` to `.env` and configure your database and JWT values.
2. Install dependencies with `npm install`.
3. Start the API with `npm run dev`.

## Scripts

- `npm run dev` - run with hot reload
- `npm run build` - compile TypeScript
- `npm start` - run the compiled server

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `POST /api/tasks` (protected)
- `GET /api/tasks` (protected)
- `PATCH /api/tasks/:id/status` (protected)
- `DELETE /api/tasks/:id`
