# Task SaaS

Task SaaS is a full-stack task management app with a TypeScript backend, a React frontend, PostgreSQL persistence, and JWT-based authentication.

## Overview

The repository is split into two apps:

- `backend` - Express API, Sequelize ORM, PostgreSQL, JWT auth, password hashing
- `frontend` - Vite + React UI with protected routes and API integration

## Features

- User signup and login
- Protected account endpoint
- Create, list, update, and delete tasks
- Task status updates
- Persistent sessions using JWT stored in the browser
- Separate environment-based configuration for local and production deployments

## Tech Stack

- Backend: Node.js, Express, TypeScript, Sequelize, PostgreSQL
- Auth: JWT, bcryptjs
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router

## Prerequisites

Before you start, make sure you have:

- Node.js 18+ installed
- npm installed
- PostgreSQL running locally or a hosted PostgreSQL instance

## Repository Structure

```text
backend/
frontend/
```

## Environment Setup

### Backend `.env`

Copy [`backend/.env.example`](backend/.env.example) to [`backend/.env`](backend/.env) and update the values for your environment.

Important variables:

- `PORT` - backend port, defaults to `5000`
- `NODE_ENV` - use `development` locally and `production` in deployed environments
- `JWT_SECRET` - long random secret used to sign tokens
- `JWT_EXPIRES_IN` - token lifetime, for example `7d`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection settings
- `DB_SSL` - set to `true` for managed production databases that require SSL
- `DATABASE_URL` - optional single connection string alternative to the individual database fields

Example:

```dotenv
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_saas
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
```

### Frontend `.env`

Create a [`frontend/.env`](frontend/.env) file and set:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Local Development

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API starts on the port defined in `backend/.env`.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

### 3. Open the app

Use the frontend URL in your browser. The frontend will call the backend API through `VITE_API_URL`.

## Available Scripts

### Backend

From the [`backend`](backend) folder:

- `npm run dev` - start the API with hot reload
- `npm run build` - compile TypeScript to `dist`
- `npm start` - run the compiled production server

### Frontend

From the [`frontend`](frontend) folder:

- `npm run dev` - start the Vite dev server
- `npm run build` - type-check and build the production bundle
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

## API Summary

Base path: `/api`

### Authentication

- `POST /api/auth/signup` - create a new user
- `POST /api/auth/login` - sign in and receive a JWT
- `GET /api/auth/me` - return the current authenticated user

### Tasks

- `POST /api/tasks` - create a task
- `GET /api/tasks` - list tasks for the current user
- `PATCH /api/tasks/:id/status` - update task status
- `DELETE /api/tasks/:id` - delete a task

Protected routes require an `Authorization: Bearer <token>` header.

## Production Notes

This project is already structured for environment-based deployment, but production environments should use the following settings:

- Use a strong, unique `JWT_SECRET`
- Set `NODE_ENV=production`
- Enable `DB_SSL=true` when your managed PostgreSQL provider requires it
- Use a real `DATABASE_URL` or production database credentials
- Configure the frontend `VITE_API_URL` to point to the deployed backend API
- Serve the frontend over HTTPS in production

Backend startup currently authenticates the database and calls `sequelize.sync()` on boot. That is fine for local development, but for stricter production workflows you may want to introduce migrations before long-term deployment.

## Deployment Checklist

- Backend dependencies installed
- Backend `.env` configured
- PostgreSQL database created and reachable
- Frontend `.env` configured with the deployed API URL
- Backend built with `npm run build`
- Frontend built with `npm run build`
- Process manager or platform service configured to run the backend `npm start`

## Troubleshooting

- If the backend cannot connect to the database, check the PostgreSQL credentials and whether SSL is required.
- If the frontend cannot log in, verify that `VITE_API_URL` points to the correct `/api` base URL.
- If requests return `401`, confirm the token is present in browser storage and the backend secret matches the current environment.

## License

MIT