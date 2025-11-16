# FocusoraHQ

FocusoraHQ is a modern, fast, and collaborative study platform with personal focus tools, shared study rooms, blogs, and a global leaderboard.

---

**Tech Stack**

- Frontend: React 19, Vite 7, Tailwind CSS 4
- Auth/DB/Analytics: Firebase v12 (Modular SDK)
- Routing: `react-router-dom` v6
- Icons/UI: `lucide-react`
- Email: `@emailjs/browser`
- Linting: ESLint 9

---

**Prerequisites**

- Node.js 18.17+ (LTS recommended) and npm 9+
- Firebase project (Web app) with Authentication enabled
- EmailJS account (optional, for Contact form)

---

**Quick Start**

- Clone and install:
	- `git clone https://github.com/Chet07-R/FocusoraHQ.git`
	- `cd FocusoraHQ`
	- `npm install`
- Configure environment variables:
	- Create a file named `.env.local` in the project root with:
		- `VITE_FIREBASE_API_KEY=...`
		- `VITE_FIREBASE_AUTH_DOMAIN=...`
		- `VITE_FIREBASE_PROJECT_ID=...`
		- `VITE_FIREBASE_STORAGE_BUCKET=...`
		- `VITE_FIREBASE_MESSAGING_SENDER_ID=...`
		- `VITE_FIREBASE_APP_ID=...`
		- `VITE_FIREBASE_MEASUREMENT_ID=...` (optional)
		- `VITE_EMAILJS_PUBLIC_KEY=...` (optional)
		- `VITE_EMAILJS_SERVICE_ID=...` (optional)
		- `VITE_EMAILJS_TEMPLATE_ID=...` (optional)
- Start the dev server:
	- `npm run dev`
	- Open the printed `http://localhost:51xx/` URL

Notes:
- Only variables prefixed with `VITE_` are exposed to the client in Vite.
- Firebase → Authentication → Settings → Authorized domains: add `localhost` and any dev hostname you use.

---

**Available Scripts**

- `npm run dev`: Start Vite dev server with HMR
- `npm run build`: Production build to `dist/`
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

---

**Project Structure**

```
FocusoraHQ/
├─ index.html
├─ package.json
├─ vite.config.js
├─ public/
│  ├─ images/
│  └─ animations/
└─ src/
	 ├─ main.jsx                # App bootstrap
	 ├─ App.jsx                 # Routes
	 ├─ firebaseConfig.js       # Firebase init (reads VITE_ envs)
	 ├─ index.css / App.css
	 ├─ components/             # Reusable UI (Navbar, Footer, etc.)
	 ├─ context/                # Auth, Theme, StudyRoom providers
	 ├─ hooks/                  # Reusable hooks
	 ├─ pages/                  # Route pages (Home, Leaderboard, etc.)
	 └─ utils/                  # Firestore utilities (leaderboard, rooms, notes)
```

Key modules:
- `src/context/AuthContext.jsx`: Auth state, login, Google sign-in, delete account.
- `src/utils/firestoreUtils.js`: Users collection, study sessions, leaderboard, rooms, todos.
- `src/pages/Leaderboard.jsx`: Real-time leaderboard (merges dynamic + static showcase data).

---

**Environment Setup (Firebase)**

- In Firebase Console → Project settings → Your apps → Web app → Config, copy values into `.env.local` as `VITE_FIREBASE_*`.
- Enable providers in Firebase → Authentication (e.g., Email/Password, Google).
- Ensure the domain is authorized under Authentication → Settings → Authorized domains.

---

**Build and Preview**

- Production build:
	- `npm run build`
- Preview build locally:
	- `npm run preview`

---

**Troubleshooting**

- Invalid API Key / Firebase auth errors:
	- Ensure `.env.local` exists and keys start with `VITE_`.
	- Restart the dev server after changing env vars.
	- Check Authorized domains in Firebase Authentication settings.
- Port already in use:
	- Vite auto-selects a free port; open the printed URL.
- Logged-in UI flicker:
	- Navbar shows a small skeleton while auth is loading to avoid flash.

---

**Contributors**

- Chetan Ajmani — [@Chet07-R](https://github.com/Chet07-R)
- Tanish Mehta — [@TanishMehta23](https://github.com/TanishMehta23)
- Vansh Thakur — [@Vans30m](https://github.com/Vans30m)
