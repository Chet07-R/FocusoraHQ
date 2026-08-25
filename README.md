<div align="center">

# FocusoraHQ

**The All-in-One AI-Powered Productivity & Study Platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white&style=flat-square)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

*Study smarter. Stay focused. Level up together.*

[Live Demo](#) · [Documentation](#documentation) · [Report a Bug](#) · [Request a Feature](#)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [AI Features](#-ai-features)
- [Gamification System](#-gamification-system)
- [Real-Time Collaboration](#-real-time-collaboration)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## Overview

**FocusoraHQ** is a full-stack, real-time productivity platform built for students, learners, and professionals who want to study smarter. It combines a beautiful personal workspace with collaborative study rooms, an AI productivity coach, gamification mechanics, and deep progress analytics — all in one cohesive experience.

> From solo deep-work sessions to synchronized group studying, FocusoraHQ keeps you in the zone.

### What makes FocusoraHQ different?

| Feature | Description |
|---|---|
| **AI Coach (Gemini)** | Context-aware AI assistant powered by Google Gemini 2.5 Flash |
| **Distraction Detection** | TensorFlow.js face/gaze detection with real-time coaching nudges |
| **Live Study Rooms** | Socket.IO-powered collaborative rooms with shared timer, notes, chat & todos |
| **Leagues & Quests** | Dynamic quest engine, league system, and leaderboard |
| **Focus Playlists** | Embedded Spotify playlists synced in real-time across room members |
| **Progress Analytics** | Session tracking, weekly heatmap, focus streak, badges & activity feed |
| **Multi-Auth** | Email/password, Google OAuth 2.0, and instant Guest mode |
| **Themes** | 5 immersive ambient background themes (Forest, Ocean, Rain, Café, Library) |

---

## Features

### Authentication & User Accounts
- **Register / Login** with email & password (bcrypt hashed)
- **Google OAuth 2.0** via Passport.js
- **Guest Mode** — jump in without an account, instant session
- **Email Verification** — 24-hour token link sent via Nodemailer
- **Resend Verification** — one-click resend from the banner
- **Forgot Password** modal flow
- **JWT-based sessions** (7-day token, stateless)
- **Profile editing** — display name, avatar, bio, Pomodoro timings, theme

### Personal Workspace (My Space)
- **Pomodoro Timer** — configurable work/break durations, circular progress ring, audio alerts, persistent state via `localStorage`
- **Notes Editor** — rich text notes with save, auto-persist, and share-to-room
- **Todo List** — add, complete, and delete tasks with point rewards
- **Focus Playlist** — embed any Spotify playlist with sync controls
- **Background Selector** — choose from 5 ambient theme backgrounds or upload custom
- **Daily Motivational Quotes** — rotating productivity quotes on each session
- **Session Tracking** — every completed Pomodoro is logged as a study session

### Collaborative Study Rooms
- **Create a Room** — name, description, timer duration
- **Join a Room** — browse active rooms, join by ID
- **Real-time Presence** — see who's in the room live
- **Synchronized Pomodoro Timer** — host controls timer, updates broadcast to all members
- **Shared Chat** — persistent message history (last 200 messages stored in MongoDB)
- **Shared Notes** — collaborative note-taking, edits attributed by user
- **Shared Todos** — add, complete, and delete tasks collaboratively
- **Shared Playlists** — update the room's Spotify playlist, all members see it instantly
- **Shared Backgrounds** — host can change the ambient background for the whole room
- **Room Deletion** — only the creator can delete a room

### AI Productivity Assistant
- **Context-aware chat** powered by Google Gemini 2.5 Flash
- Knows your current page, active task, notes content, and selected text
- **Tiered rate limits** — authenticated (120 req/15min), guest (20 req/hr), anonymous (6 req/10min)
- Floating chat widget accessible from anywhere in the app
- Persistent conversation history within a session

### Distraction Detection
- **TensorFlow.js + BlazeFace** model runs entirely in the browser (no data sent to server)
- Detects face missing, gaze away, and idle signals
- Real-time productivity coaching tips delivered on distraction detection
- Server-side keyword classifier for tab-title / clipboard text analysis

### Gamification
- **Points System** — earn XP for every Pomodoro minute, saved note, added task, completed task
- **Focus Streak** — daily consecutive focus streaks tracked per user
- **Best Streak** — all-time personal best streak persisted
- **Badges** — 6 milestone badges (First Session, 10 Sessions, 25 Hours, 100 Hours, 7-Day Streak, 30-Day Streak)
- **Quests** — rotating dynamic quests (sessions, minutes, streak, points). Completing quests unlocks rewards
- **Leagues** — Bronze → Silver → Gold → Platinum → Diamond based on total points
- **Leaderboard** — global ranking by points or study time, filterable by location and timeframe

### Profile & Analytics
- **Study Stats** — total study time, sessions count, focus streak, best streak
- **Weekly Heatmap** — study activity grid for the current week
- **Activity Feed** — recent events timeline (sessions, achievements, quests)
- **My Blogs** — manage published blog posts from profile
- **Location Tracking** — optional geolocation for regional leaderboard filtering

### Blogging Platform
- Curated static blogs covering productivity, focus, and study techniques
- **Community blogs** — user-generated content with `blogId`-based dynamic routes
- Blog listing and rich reading pages

### Reviews
- Homepage testimonial section with live review data from MongoDB
- Users can submit star ratings and role-tagged reviews

### Contact & Support
- **Contact form** powered by EmailJS
- **Help Center** — FAQ-style self-serve support page
- **Documentation** page — platform usage guide
- **About**, **Careers**, **Press** — informational pages

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  React 19 + Vite 7 + TailwindCSS 4 + Socket.IO-Client      │
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────┐  │
│  │  Pages   │ │Components │ │   Contexts   │ │ TF.js AI │  │
│  │  (26)    │ │   (17)    │ │ Auth/Room/   │ │BlazeFace │  │
│  │          │ │           │ │ Theme        │ │          │  │
│  └──────────┘ └───────────┘ └──────────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP REST + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│              SSR SERVER (Express + Vite SSR)                │
│              server.js — serves HTML + proxies API          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               BACKEND API (Express 5 + Node 18+)            │
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────┐  │
│  │  Routes  │ │Controllers│ │  Middleware  │ │Socket.IO │  │
│  │  /api/*  │ │  (11)     │ │Helmet,CORS,  │ │  Server  │  │
│  │          │ │           │ │Rate Limit,   │ │          │  │
│  │          │ │           │ │JWT Auth      │ │          │  │
│  └──────────┘ └───────────┘ └──────────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│                    MongoDB Database                         │
│    Users · StudyRooms · Sessions · Notes · Todos            │
│    Blogs · Reviews · ActivityEvents                         │
└─────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              External Services                              │
│  Google OAuth 2.0 · Gemini 2.5 Flash AI · Nodemailer SMTP  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
FocusoraHQ/
├── index.html                 # HTML shell (Vite entry)
├── server.js                  # SSR/CSR Express server
├── vite.config.js             # Vite config (proxy, SSR, Tailwind)
├── package.json               # Frontend dependencies
├── vercel.json                # Vercel deployment config
├── .env.example               # Frontend env template
│
├── src/                       # Frontend source
│   ├── main.jsx               # CSR entry
│   ├── entry-client.jsx       # SSR client hydration
│   ├── entry-server.jsx       # SSR server rendering
│   ├── App.jsx                # Root router + layout
│   ├── AppRoot.jsx            # Context providers wrapper
│   ├── api.js                 # Axios base instance
│   ├── index.css              # Global base styles
│   │
│   ├── pages/                 # Route-level page components (26 files)
│   │   ├── Home.jsx           # Landing page with reviews
│   │   ├── MySpace.jsx        # Personal workspace
│   │   ├── StudyRoom.jsx      # Room browser/join hub
│   │   ├── StudyRoom-1.jsx    # Active collaborative room
│   │   ├── JoinSpace.jsx      # Join room by ID
│   │   ├── CreateSpace.jsx    # Create new room
│   │   ├── Leaderboard.jsx    # Global leaderboard
│   │   ├── Profile.jsx        # User profile & stats
│   │   ├── EditProfile.jsx    # Profile editor
│   │   ├── SignIn.jsx         # Login page
│   │   ├── SignUp.jsx         # Registration page
│   │   ├── VerifyEmail.jsx    # Email verification handler
│   │   ├── Blog.jsx           # Blog listing
│   │   ├── Blog1.jsx          # Blog post 1
│   │   ├── Blog2.jsx          # Blog post 2
│   │   ├── BlogCustom.jsx     # Dynamic community blog
│   │   ├── Community.jsx      # Community hub
│   │   ├── About.jsx          # About page
│   │   ├── Careers.jsx        # Careers page
│   │   ├── Contact.jsx        # Contact form (EmailJS)
│   │   ├── Documentation.jsx  # Platform docs
│   │   ├── HelpCenter.jsx     # FAQ & support
│   │   ├── Press.jsx          # Press / media
│   │   └── Terms.jsx          # Terms of service
│   │
│   ├── components/            # Reusable UI components (17 files)
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Footer.jsx         # Site footer
│   │   ├── ChatWidget.jsx     # Floating AI chat widget
│   │   ├── Pomodoro.jsx       # Circular Pomodoro timer
│   │   ├── Notes.jsx          # Rich text notes editor
│   │   ├── Todo.jsx           # Task list
│   │   ├── FocusPlaylist.jsx  # Spotify embed + controls
│   │   ├── BackgroundSelector.jsx   # Theme background picker
│   │   ├── EmailVerificationBanner.jsx  # Unverified email banner
│   │   ├── ForgotPasswordModal.jsx  # Password reset modal
│   │   ├── ProfileIcon.jsx    # User avatar/icon
│   │   ├── DefaultAvatar.jsx  # SVG fallback avatar
│   │   └── ScrollToTop.jsx    # Route scroll-to-top
│   │
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Auth state, user profile, JWT
│   │   ├── StudyRoomContext.jsx  # Room state, Socket.IO
│   │   └── ThemeContext.jsx   # Dark/light mode toggle
│   │
│   ├── constants/
│   │   └── pointsSystem.js   # XP/points rules
│   │
│   └── utils/
│       ├── firestoreUtils.js  # Firebase/Firestore helpers
│       ├── activityLog.js     # Activity event logging
│       ├── blogsApi.js        # Blog CRUD API calls
│       ├── reviewsApi.js      # Reviews API calls
│       ├── roomsApi.js        # Rooms REST API calls
│       ├── email.js           # EmailJS helpers
│       └── authErrors.js      # Auth error message map
│
└── backend/                   # Backend API server
    ├── server.js              # HTTP server + Socket.IO init
    ├── seed.js                # Database seeder script
    ├── package.json           # Backend dependencies
    ├── vercel.json            # Backend Vercel config
    ├── .env.example           # Backend env template
    └── src/
        ├── app.js             # Express app factory
        ├── config/
        │   ├── env.js         # Typed env loader
        │   └── passport.js    # Google OAuth strategy
        ├── controllers/       # Business logic (11 files)
        │   ├── authController.js
        │   ├── usersController.js
        │   ├── roomsController.js
        │   ├── notesController.js
        │   ├── todosController.js
        │   ├── sessionsController.js
        │   ├── blogsController.js
        │   ├── reviewsController.js
        │   ├── activityController.js
        │   ├── distractionController.js
        │   └── aiController.js
        ├── models/            # Mongoose schemas (8 files)
        │   ├── User.js
        │   ├── StudyRoom.js
        │   ├── StudySession.js
        │   ├── Note.js
        │   ├── Todo.js
        │   ├── Blog.js
        │   ├── Review.js
        │   └── ActivityEvent.js
        ├── routes/            # Express routers (12 files)
        │   └── index.js       # Route aggregator
        ├── middlewares/
        │   ├── auth.js        # JWT authGuard & optionalAuth
        │   ├── errorHandler.js
        │   ├── rateLimit.js   # Auth & API rate limiters
        │   ├── requestContext.js  # Request ID injection
        │   ├── upload.js      # Multer file upload config
        │   └── validate.js    # express-validator runner
        ├── sockets/
        │   └── index.js       # Socket.IO server & events
        ├── utils/
        │   ├── apiResponse.js    # Standardized ok/fail helpers
        │   ├── asyncHandler.js   # try/catch wrapper
        │   ├── createToken.js    # JWT signing
        │   ├── mailer.js         # Nodemailer SMTP helper
        │   ├── questEngine.js    # Quest lifecycle engine
        │   └── userProgress.js   # Focus streak & session logic
        └── validators/
            └── authValidators.js  # Register/login validators
```

---

## Frontend

### Pages & Routing

All routes are registered in `src/App.jsx` with React Router v6:

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with hero, features, and reviews |
| `/my-space` | `MySpace` | Personal study workspace |
| `/study-room` | `StudyRoom` | Active collaborative room |
| `/study-room-1` | `StudyRoom1` | Legacy/Firebase-backed room variant |
| `/join-space` | `JoinSpace` | Browse & join active rooms |
| `/create-space` | `CreateSpace` | Create a new study room |
| `/leaderboard` | `Leaderboard` | Global rankings & leagues |
| `/profile` | `Profile` | User profile, stats, badges |
| `/edit-profile` | `EditProfile` | Edit profile details & preferences |
| `/signin` | `SignIn` | Login (email/password + Google) |
| `/signup` | `SignUp` | Create new account |
| `/verify-email` | `VerifyEmail` | Email verification landing |
| `/blog` | `Blog` | Blog listing page |
| `/blog1` | `Blog1` | Static blog post 1 |
| `/blog2` | `Blog2` | Static blog post 2 |
| `/blog/community/:blogId` | `BlogCustom` | Dynamic community blog |
| `/community` | `Community` | Community hub |
| `/about` | `About` | About FocusoraHQ |
| `/careers` | `Careers` | Careers page |
| `/contact` | `Contact` | Contact form |
| `/documentation` | `Documentation` | Platform documentation |
| `/help-center` | `HelpCenter` | FAQ & help articles |
| `/press` | `Press` | Press & media kit |
| `/terms` | `Terms` | Terms of service |

### Components

| Component | Purpose |
|---|---|
| `Navbar` | Responsive navigation with auth state, dark mode toggle |
| `Footer` | Site-wide footer with links and social icons |
| `ChatWidget` | Floating AI chat bubble (Gemini), session history |
| `Pomodoro` | Circular SVG progress timer with work/break cycles |
| `Notes` | Rich text area with save, word count, share-to-room |
| `Todo` | Add/complete/delete tasks with XP rewards |
| `FocusPlaylist` | Spotify iframe embed with play/pause sync |
| `BackgroundSelector` | Ambient background grid picker |
| `EmailVerificationBanner` | Top banner for unverified accounts |
| `ForgotPasswordModal` | Password reset flow modal |
| `ProfileIcon` | User avatar with fallback to `DefaultAvatar` |
| `ScrollToTop` | Scrolls window to top on route change |

### State Management & Contexts

```
AppRoot.jsx
├── AuthContext        — JWT token, user profile, login/logout/register
├── StudyRoomContext   — Room state, participants, chat, todos, socket events
└── ThemeContext       — Dark/light mode preference
```

**`AuthContext`** manages:
- JWT token storage (header-based)
- `user` and `userProfile` objects
- Auth actions: `login`, `register`, `guestLogin`, `logout`, `refreshProfile`

**`StudyRoomContext`** manages:
- `currentRoom`, `roomData`, `participants`
- `chatMessages`, `roomTodos`, `roomFiles`
- Room CRUD and Socket.IO event dispatching

**`ThemeContext`** manages:
- `darkMode` boolean toggle persisted to `localStorage`

### Styling & Theming

- **TailwindCSS v4** with Vite plugin — utility-first, JIT, dark mode classes
- **Vanilla CSS** files for complex page-specific layouts (`MySpace.css`, `Home.css`, `Navbar.css`, `Footer.css`, `ChatWidget.css`)
- **5 Ambient Themes**: `forest`, `ocean`, `rain`, `cafe`, `library` — full-page background images applied dynamically
- **Dark mode** — system-aware toggle with `ThemeContext`
- **Lucide React** and **@heroicons/react** for iconography
- `react-circular-progressbar` for the Pomodoro ring

---

## Backend

### API Endpoints

All routes are prefixed with `/api`.

#### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | None | Create account, send verification email |
| `POST` | `/login` | None | Login with email + password |
| `POST` | `/guest` | None | Instant guest session |
| `GET` | `/verify-email?token=` | None | Verify email via token link |
| `POST` | `/resend-verification` | None | Resend verification email |
| `GET` | `/me` | JWT | Get current user profile |
| `GET` | `/google` | None | Initiate Google OAuth flow |
| `GET` | `/google/callback` | None | Google OAuth callback |
| `GET` | `/google/failure` | None | Google OAuth failure handler |

#### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/profile` | JWT | Get own profile |
| `PATCH` | `/profile` | JWT | Update profile (name, bio, photo, theme, Pomodoro) |
| `POST` | `/upload-photo` | JWT | Upload avatar (Multer) |
| `GET` | `/leaderboard` | None | Fetch leaderboard data |
| `POST` | `/location` | JWT | Update user geolocation |
| `GET` | `/:id` | None | Get public user profile |

#### Study Rooms — `/api/rooms`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | None | List all active rooms |
| `POST` | `/` | JWT | Create a new room |
| `GET` | `/:id` | None | Get room details |
| `DELETE` | `/:id` | JWT | Soft-delete room (creator only) |
| `POST` | `/:id/join` | JWT | Join a room |
| `POST` | `/:id/leave` | JWT | Leave a room |
| `PATCH` | `/:id/notes` | JWT | Update shared notes |
| `POST` | `/:id/todos` | JWT | Add a room todo |
| `PATCH` | `/:id/todos/:todoId` | JWT | Toggle/update a todo |
| `DELETE` | `/:id/todos/:todoId` | JWT | Delete a todo |

#### Notes — `/api/notes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | Get user's notes |
| `POST` | `/` | JWT | Create a note |
| `PUT` | `/:id` | JWT | Update a note |
| `DELETE` | `/:id` | JWT | Delete a note |

#### Todos — `/api/todos`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | Get user's todos |
| `POST` | `/` | JWT | Create a todo |
| `PATCH` | `/:id` | JWT | Toggle/update a todo |
| `DELETE` | `/:id` | JWT | Delete a todo |

#### Sessions — `/api/sessions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | Get all study sessions |
| `POST` | `/` | JWT | Log a completed session |

#### Blogs — `/api/blogs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | None | List all blogs |
| `POST` | `/` | JWT | Create a blog |
| `GET` | `/:id` | None | Get blog by ID |
| `DELETE` | `/:id` | JWT | Delete own blog |

#### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | None | List reviews |
| `POST` | `/` | None | Submit a review |

#### Activity — `/api/users/activity`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | Get user activity events |
| `POST` | `/` | JWT | Log an activity event |

#### Distraction Coach — `/api/distraction`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/coach` | None | Classify text/signal, return coaching tip |

#### AI — `/api/ai`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/chat` | Optional | Chat with Gemini AI |
| `GET` | `/models` | Optional | List available Gemini models |

---

### Database Models

#### `User`
```js
{
  displayName, email, passwordHash, photoURL,
  provider: 'local' | 'google' | 'guest',
  googleId,
  points, totalStudyMinutes, sessionsCount,
  focusStreak, bestFocusStreak, lastFocusDate,
  bio, pomodoroWork (1-60), pomodoroBreak (1-60),
  theme: 'forest' | 'ocean' | 'rain' | 'cafe' | 'library',
  showOnLeaderboard, allowMessages, notifications,
  isEmailVerified, emailVerificationTokenHash, emailVerificationTokenExpiresAt,
  questState: { active, completedCount, rewards, history, lastCompletedAt },
  location, locationCoords: { lat, lng }
}
```

#### `StudyRoom`
```js
{
  name, description, createdBy (ref: User), active,
  participants: [{ userId, displayName, photoURL }],
  participantCount,
  timer: { duration, remaining, isRunning, startedAt, lastUpdatedAt },
  sharedNotes, notesUpdatedById, notesUpdatedByName, notesUpdatedAt,
  spotifyUrl, playlistUpdatedById, playlistUpdatedByName, playlistUpdatedAt,
  backgroundUrl, backgroundUpdatedById, backgroundUpdatedByName, backgroundUpdatedAt,
  chatMessages: [{ id, userId, displayName, message, timestamp }],  // max 200
  todos: [{ id, text, completed, createdById, createdByName, createdAt }]
}
```

#### `StudySession`
```js
{ userId, durationMinutes, startTime, endTime, roomId }
```

#### `Note`
```js
{ userId, content, updatedAt }
```

#### `Todo`
```js
{ userId, text, completed, createdAt }
```

#### `Blog`
```js
{ title, content, author, authorId, tags, createdAt }
```

#### `Review`
```js
{ name, role, rating, message, avatarUrl, createdAt }
```

#### `ActivityEvent`
```js
{ userId, type, metadata, createdAt }
```

---

### Socket.IO Events

The Socket.IO server runs on the same HTTP server and uses JWT for optional authentication.

#### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join-room` | `{ roomId, user }` | Join a study room channel |
| `leave-room` | `{ roomId, user }` | Leave a study room channel |
| `timer-update` | `{ roomId, timerData }` | Broadcast timer state, persisted to DB |
| `send-message` | `{ roomId, message }` | Send chat message, stored (last 200) |
| `share-notes` | `{ roomId, notes }` | Broadcast notes to room members |
| `todo-added` | `{ roomId, todo }` | Notify room of new todo |
| `todo-toggled` | `{ roomId, todoId, completed }` | Sync todo completion |
| `todo-deleted` | `{ roomId, todoId }` | Sync todo deletion |
| `update-playlist` | `{ roomId, spotifyUrl }` | Sync playlist URL |
| `update-background` | `{ roomId, backgroundUrl }` | Sync background image |
| `sync-playback` | `{ roomId, action }` | Sync Spotify play/pause |

#### Server → Client

| Event | Payload | Description |
|---|---|---|
| `user-joined` | `{ roomId, user }` | A user joined the room |
| `user-left` | `{ roomId, user }` | A user left (or disconnected) |
| `timer-update` | `timerData` | Timer state update from host |
| `receive-message` | `message` | Incoming chat message |
| `share-notes` | `notes` | Updated shared notes |
| `todo-received` | `todo` | New todo added |
| `todo-toggled-received` | `{ todoId, completed }` | Todo completion synced |
| `todo-deleted-received` | `{ todoId }` | Todo deleted |
| `update-playlist` | `{ spotifyUrl }` | Playlist updated |
| `update-background` | `{ backgroundUrl }` | Background updated |
| `sync-playback` | `{ action, ... }` | Playback sync |
| `room-data-updated` | `{ roomId }` | Generic room data change notification |

---

### Security & Middleware

| Middleware | Purpose |
|---|---|
| **Helmet** | Sets secure HTTP headers (CSP, HSTS, XSS protection) |
| **CORS** | Whitelist of configured origins + localhost in dev |
| **Morgan** | HTTP request logging (structured JSON in production) |
| **authRateLimit** | 30 req/15min on `/api/auth/*` |
| **apiRateLimit** | 400 req/15min on all other `/api/*` |
| **aiRateLimit** | Tiered: 120/20/6 based on auth provider |
| **JWT authGuard** | Verifies Bearer token, attaches `req.user` |
| **optionalAuth** | Attaches user if token present, continues if not |
| **requestContext** | Injects unique `requestId` for distributed tracing |
| **express-validator** | Input validation on register/login routes |
| **Multer** | Multipart file upload for avatar images |
| **asyncHandler** | Wraps controllers to forward errors to global handler |
| **errorHandler** | Centralized error response formatter |

---

## AI Features

FocusoraHQ integrates **Google Gemini 2.5 Flash** as its AI backbone:

### AI Chat Widget
- Accessible from every page via the floating chat button
- Maintains full conversation history within the session
- Sends app context with every message:
  - Current page name
  - Active task/todo
  - Notes content preview (up to 1,200 chars)
  - Selected text (up to 300 chars)
  - Uploaded files list

### Distraction Coaching
- **Browser-side**: TensorFlow.js `blazeface` detects face presence and gaze direction — no image data leaves the device
- **Server-side** `/api/distraction/coach` accepts text or signal and returns:
  - `distracted: boolean`
  - `reason: string`
  - `tip: string` — actionable coaching tip
- Supported signals: `face_missing`, `look_away`, `idle`
- Keyword classifier catches: TikTok, Instagram, YouTube, Netflix, Reddit, Twitter, Discord, Gaming, Shopping, etc.

---

## Gamification System

### Points (XP)

| Action | Points |
|---|---|
| 1 Pomodoro minute completed | +1 XP |
| Save notes | +1 XP |
| Add a task | +1 XP |
| Complete a task | +2 XP |

### Focus Streak
- Increments daily when a session is logged
- Resets if a day is missed
- `bestFocusStreak` is updated whenever `focusStreak` exceeds it

### Badges (6 milestones)

| Badge | Icon | Condition |
|---|---|---|
| First Focus | 🎯 | 1 session |
| 10 Sessions | 📚 | 10 sessions |
| 25 Hours | ⏱️ | 1,500 study minutes |
| 100 Hours | 🏆 | 6,000 study minutes |
| 7-Day Streak | 🔥 | 7-day focus streak |
| 30-Day Streak | 🌟 | 30-day focus streak |

### Quests

Dynamic rotating quests through 4 categories: `sessions → minutes → streak → points`

Target scales progressively with each completion. Completion unlocks reward packs:

| Quest Type | Reward Pack | Bonus XP |
|---|---|---|
| Sessions | Focus Sprinter Badge / Momentum Title | 25 / 20 |
| Minutes | Aurora Theme Token / Focus Frame | 35 / 30 |
| Streak | Streak Shield / Streak Emblem | 40 / 30 |
| Points | XP Booster / Reward Token | 50 / 45 |

### Leagues

| League | Icon | Points Required |
|---|---|---|
| Bronze | 🥉 | 0+ |
| Silver | 🥈 | 500+ |
| Gold | 🥇 | 1,200+ |
| Platinum | 💎 | 2,500+ |
| Diamond | 💠 | 5,000+ |

---

## Real-Time Collaboration

FocusoraHQ Study Rooms deliver a fully synchronized collaborative environment:

1. **Room Creation** — stored in MongoDB with initial timer, empty chat, notes, todos
2. **Join Flow** — user joins Socket.IO room channel, presence broadcast to all members
3. **Timer Sync** — host updates timer → Socket.IO event → persisted in MongoDB → `room-data-updated` triggers client refresh
4. **Chat** — messages broadcast instantly, stored (sliding window of 200) in MongoDB
5. **Notes** — shared text area, updates attributed to editor, broadcast via `share-notes`
6. **Todos** — three events: `todo-added`, `todo-toggled`, `todo-deleted` with full room sync
7. **Playlist** — Spotify URL synced to all members and stored in room document
8. **Background** — ambient background change synced to all members
9. **Disconnect handling** — `user-left` emitted automatically on socket disconnect

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+
- **MongoDB** (local or MongoDB Atlas)
- **Google Gemini API Key** (for AI features)
- **Google OAuth credentials** (optional, for Google login)
- **SMTP credentials** (for email verification via Nodemailer)

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/FocusoraHQ.git
cd FocusoraHQ
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

---

### Environment Variables

#### Frontend — `.env` (root directory)

Copy `.env.example` to `.env` and fill in values:

```env
# All VITE_ variables are exposed to the browser

# Firebase (required if using Firestore-backed rooms)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# EmailJS (optional — for Contact form)
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_WELCOME_TEMPLATE_ID=your_welcome_template_id
VITE_EMAILJS_SIGNIN_TEMPLATE_ID=your_signin_template_id
```

#### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/focusorahq

# JWT
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Gemini AI (required for AI features)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Email / SMTP (required for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@focusorahq.com
```

---

### Running Locally

**Start the backend** (runs on port 5000):
```bash
cd backend
npm run dev
```

**Start the frontend** (in a new terminal, runs on port 5173):
```bash
# From the root directory
npm run dev:csr
```

> The Vite dev server automatically proxies `/api`, `/uploads`, and `/socket.io` requests to `http://localhost:5000`.

Or use **SSR mode** (serves both from one Express server):
```bash
# From the root directory
npm run build    # Build frontend for SSR
npm run dev      # Serve via SSR Express server
```

---

### Seeding the Database

Populate MongoDB with sample users, reviews, and blogs:

```bash
cd backend
node seed.js
```

This creates several test users (password: `password123`) and sample community data.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| Vite | 7 | Build tool + Dev server |
| TailwindCSS | 4 | Utility-first CSS |
| React Router DOM | 6 | Client-side routing |
| Socket.IO Client | 4 | Real-time WebSocket communication |
| TensorFlow.js Core | 4.22 | Browser ML runtime |
| TensorFlow.js WebGL | 4.22 | GPU-accelerated ML backend |
| @tensorflow-models/blazeface | 0.1 | Face detection model |
| React Circular Progressbar | 2.2 | Pomodoro timer ring |
| Axios | 1.13 | HTTP client |
| @emailjs/browser | 4.4 | Contact form emails |
| Lucide React | 0.553 | Icon library |
| @heroicons/react | 2.2 | Supplemental icons |
| Express | 5 | SSR proxy server |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5 | Web framework |
| Mongoose | 9.3 | MongoDB ODM |
| Socket.IO | 4.8 | WebSocket server |
| jsonwebtoken | 9 | JWT auth |
| bcryptjs | 3 | Password hashing |
| Passport.js | 0.7 | OAuth strategy runner |
| passport-google-oauth20 | 2 | Google OAuth 2.0 |
| Nodemailer | 8 | Email sending |
| Multer | 2 | File uploads |
| Helmet | 8 | Security headers |
| express-rate-limit | 8 | Rate limiting |
| express-validator | 7 | Input validation |
| Morgan | 1.10 | HTTP logging |
| dotenv | 17 | Env variable loader |
| nodemon | 3 | Dev auto-restart |

---

## Roadmap

- [ ] Mobile-responsive Study Rooms
- [ ] File sharing inside rooms (upload + preview)
- [ ] Spotify OAuth for personal playlist control
- [ ] Pomodoro analytics dashboard with historical charts
- [ ] Push notifications for session reminders
- [ ] Public profile pages with shareable stats
- [ ] Custom dark theme builder
- [ ] Study group scheduling & calendar integration
- [ ] AI-generated study plans from notes
- [ ] Offline mode with service worker caching

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request**

### Code Style
- ESLint is configured — run `npm run lint` before committing
- Follow existing patterns for controllers, routes, and React components

---

## License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ for focused learners everywhere**

[Back to top](#-focusorahq)

</div>
