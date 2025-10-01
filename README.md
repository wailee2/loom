# Loom

> Frontend for GreenGrass — real-estate property management platform.

[Live demo](https://loom-in.vercel.app)

---

## Table of contents

* [About](#about)
* [Demo](#demo)
* [Key features](#key-features)
* [Tech stack](#tech-stack)
* [Getting started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Install (frontend)](#install-frontend)
  * [Run locally](#run-locally)
  * [Build for production](#build-for-production)
  * [Backend integration (GreenGrass backend)](#backend-integration-greengrass-backend)
* [Project structure](#project-structure)
* [Testing](#testing)
* [Deployment](#deployment)
* [CORS & environment notes](#cors--environment-notes)

---

## About

**Loom** is a responsive, component-based single-page app created with Vite, Tailwind CSS (v4), Shadcn UI and Framer Motion. It focuses on fast developer experience, accessible and reusable UI components, smooth interactions, and production deployment to Vercel.

## Demo

A live instance of the app is deployed here:

* [https://loom-in.vercel.app](https://loom-in.vercel.app)

## Key features

* Component-driven UI built with Shadcn UI and Tailwind CSS for rapid development and consistent design.
* Smooth, declarative animations using Framer Motion for polished UX.
* Ready for real-time features (chat/notifications) via Pusher.
* Production-ready build and deployment configuration for Vercel.

## Tech stack

* **React** + **Vite**
* **Tailwind CSS v4**
* **Shadcn UI**
* **Framer Motion**

## Getting started

### Prerequisites

* Node.js (LTS recommended)
* npm (or yarn/pnpm if you prefer)

### Install (frontend)

Run these commands from the repository root (or `cd frontend` if your repo is monorepo-styled):

```bash
# clone the repo (if not already cloned)
git clone https://github.com/wailee2/loom.git
cd loom

# install dependencies
npm install

# install UI/animation libs (if not present in package.json)
npm install tailwindcss @tailwindcss/vite framer-motion shadcn-ui
```

If your project already lists these in `package.json`, `npm install` above will install them automatically.

### Run locally

```bash
# start dev server (hot reload)
npm run dev
```

By default Vite runs on `http://localhost:5173`. If your backend expects a different port (the GreenGrass backend README references `http://localhost:5137`), make sure the backend `FRONTEND_URL` or `CORS` setting matches the port you use for the frontend dev server.

### Build for production

```bash
npm run build
# preview production build locally
npm run preview
```

## Backend integration (GreenGrass backend)

This frontend is designed to work with the GreenGrass Django backend. To integrate locally:

1. Ensure the backend is running (see backend repo for setup and migrations). The backend normally runs on `http://localhost:8000`.
2. Set your frontend environment variables (see below) so the frontend can reach the API and Pusher.

### Frontend Environment Variables

Create a `.env` (or `.env.local`) file in the frontend directory with these variables:

```bash
VITE_API_URL=http://localhost:8000/api
```

> Note: Vite requires env vars prefixed with `VITE_` to be exposed to the client-side code.

### Backend Environment Variables (backend repo)

When running the backend locally, the backend `.env` should include matching values

Make sure the `FRONTEND_URL` in the backend matches the actual port you run the frontend dev server on.

## Project structure


/ loom
├─ index.html
├─ components.json
├─ js.config.json
├─ package.json
├─ vercel.json
├─ vite.config.js
├─ src/                # source files (components, styles, etc.)
└─ public/             # static assets

Adjust this section to reflect your repository's actual structure.

## Testing

If you add tests, document how to run them here (e.g. `npm test`).

## Deployment

### Vercel

This project is ready to deploy on Vercel. When deploying, set the following environment variables in the Vercel dashboard for your project:

* `VITE_API_URL` — production backend API URL (e.g. `https://api.greengrass.example.com/api`)
* `VITE_PUSHER_KEY`
* `VITE_PUSHER_CLUSTER`

> Private channels require the backend to authenticate subscriptions. The backend should implement the private channel auth endpoints and sign requests using your Pusher keys.

## CORS & environment notes

When running backend and frontend locally, ensure backend CORS allows the frontend dev URL. Typical CORS whitelist values:

* Development: `http://localhost:5173`
* Production: `https://loom-in.vercel.app`

If the backend is configured with a specific `FRONTEND_URL` env var, set it to the same origin and port as the frontend dev server.
