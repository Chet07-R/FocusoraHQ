# FocusoraHQ

FocusoraHQ is a collaborative study platform combining personal focus tools, shared study rooms, blogs, and leaderboards. This repository contains the frontend (React + Vite) and a Node.js backend (Express + MongoDB + Socket.IO) used for authentication, REST APIs, email, and realtime rooms.

---

**Tech summary**

- Frontend: React 19, Vite
- Styling: Tailwind CSS
- Client-side auth / realtime helpers: Firebase (used by some frontend utilities)
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO
- Email: Nodemailer
- Auth: JWT and Passport (Google OAuth)

---

**Prerequisites**

- Node.js 18+ and npm
- MongoDB (Atlas or local) for the backend
- Firebase project (if using the frontend's Firebase hooks)

---

**Quick local setup**

1. Clone the repo and install root deps:

```
git clone https://github.com/Chet07-R/FocusoraHQ.git
cd FocusoraHQ
npm install
```

2. Frontend dev (CSR-only):

```
npm run dev:csr
```

3. Full server (SSR/static + API proxy) mode (root server):

```
npm run dev
```

4. Run backend API locally (recommended when working on API or sockets):

```
cd backend
npm install
npm run dev
```

Ports and endpoints:
- The backend dev server uses port 5000 by default (see `backend/server.js`).
- The root `server.js` integrates Vite and serves SSR/preview builds when used.

---

**Environment variables**

Frontend (Vite): prefix client-exposed variables with `VITE_` in `.env.local` at project root. Common keys used in the frontend:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_EMAILJS_PUBLIC_KEY` (optional)

Backend (create `.env` inside `backend/`):

- `MONGODB_URI` (required)
- `JWT_SECRET` (required for JWT auth)
- `JWT_EXPIRES_IN`
- `CLIENT_URL` or `FRONTEND_URL` (for CORS)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (optional)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` (for emails)

---

**Scripts**

- Root:
  - `npm run dev` — start the integrated Node server (SSR/dev server)
  - `npm run dev:csr` — run Vite development server (client-only)
  - `npm run build` — build client + server bundles
  - `npm run preview` — preview production server

- Backend (inside `backend/`):
  - `npm run dev` — start backend with `nodemon` (kills conflicting port first)
  - `npm start` — run backend once (production)

---

**Project structure (overview)**

```
.
├─ backend/                  # Express API, sockets, email, auth
│  ├─ api/                   # Vercel-compatible serverless handlers
│  ├─ src/                   # server source (controllers, models, routes)
│  ├─ server.js              # backend entry
│  └─ package.json
├─ public/                   # static assets
├─ src/                      # frontend source (React + Vite)
└─ server.js                 # root server that can run SSR + proxy
```

Key frontend modules live in `src/` (components, pages, contexts, hooks). Key backend modules live in `backend/src/` (models, controllers, routes).

---

**Deployment notes**

- Backend can be deployed separately (Vercel, Render, Heroku). If using Vercel serverless functions, avoid hosting long-lived Socket.IO servers there — prefer a persistent host for realtime sockets.
- Always set `CLIENT_URL` in backend environment to the frontend origin for correct CORS behavior.

---

**Contributing**

Contributions are welcome. Open an issue or submit a PR with a clear description of changes and associated tests or screenshots where applicable.

---

**Credits**

- Chetan Ajmani 
- Tanish Mehta
- Vansh Thakur
- Bhavya Jain