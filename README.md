<div align="center">

# FocusoraHQ

### Collaborative Study & AI-Powered Focus Platform

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-BlazeFace-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)
[![Tests](https://img.shields.io/badge/Tests-23%20Passed%20(100%25)-success?style=for-the-badge&logo=node.js&logoColor=white)](#automated-testing--qa-architecture)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

**FocusoraHQ** is an all-in-one productivity and virtual co-studying platform that combines real-time collaborative study rooms, AI-powered computer-vision distraction detection, customized Pomodoro workflows, interactive gamified leaderboards, and an AI study companion — available as a full-stack web application and a native Windows desktop app.

[Live Demo](https://focusora-hq.vercel.app/) · [Report a Bug](https://github.com/Vans30m/FocusoraHQ/issues)

</div>

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Database Schema & Models](#database-schema--models)
- [API Reference](#api-reference)
- [AI / ML & Computer Vision Workflows](#ai--ml--computer-vision-workflows)
- [Authentication Flow](#authentication-flow)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Desktop App Build (Electron)](#desktop-app-build-electron)
- [Automated Testing & QA Architecture](#automated-testing--qa-architecture)
- [Security Architecture](#security-architecture)
- [License](#license)

---

## System Overview

**Problem Solved:** Remote and hybrid students struggle with isolation, lack of accountability, digital screen distractions, and scattered study tools (separate timers, notes, music, and to-do apps).

**Core Mission:** Provide a unified, distraction-free virtual study sanctuary that leverages real-time peer presence and client-side computer vision to elevate focus, consistency, and motivation.

**Target Audience:** Students, researchers, software engineers, and remote professionals who benefit from deep-work pomodoro sessions and social co-working accountability.

**Architecture Paradigm:** Monorepo with dedicated client, server, and desktop isolation:
- `frontend/` → React 19 SPA (Vite + Tailwind CSS v4 + TensorFlow BlazeFace)
- `backend/` → Express 5 REST & WebSocket API (Node.js + MongoDB Mongoose + Socket.io)
- `electron/` → Standalone desktop app bundled via `electron-builder` with custom branding

---

## Architecture

```
+----------------------------------------------------------------------+
|                         CLIENT LAYER                                 |
|                                                                      |
|   +-----------------------------+   +-----------------------------+  |
|   |   React SPA (Vite + JSX)    |   |  Electron Desktop App       |  |
|   |   React Router v6           |   |  (Native Windows Executable |  |
|   |   TensorFlow.js BlazeFace   |   |   with Embedded Backend &   |  |
|   |   Tailwind CSS v4           |   |   Context Isolation)        |  |
|   |   Socket.io Client          |   +-----------------------------+  |
|   +------------+----------------+                                    |
+----------------+-----------------------------------------------------+
                 |  HTTPS REST / WSS WebSocket (JWT Bearer)
                 v
+----------------------------------------------------------------------+
|                         API LAYER (Express 5)                        |
|                                                                      |
|  +----------+ +----------+ +----------+ +----------+ +----------+  |
|  |  /auth   | |  /rooms  | |  /blogs  | | /reviews | | /profile |  |
|  +----------+ +----------+ +----------+ +----------+ +----------+  |
|                                                                      |
|  Middleware & Socket Layer:                                          |
|  [Helmet] -> [CORS] -> [Morgan] -> [Rate Limiter] -> [JWT Auth]      |
|  Socket.io Server: Room Join/Leave, WebRTC Signals, Live Room State  |
+---------+------------------------------------------------------------+
          |
    +-----+--------------------------------------------------+
    |                   INTEGRATION LAYER                    |
    |                                                        |
    |  +--------------+  +--------------+  +--------------+  |
    |  | BlazeFace AI |  | Google OAuth |  |  Nodemailer  |  |
    |  | (Client ML)  |  |  Passport.js |  | (SMTP Auth)  |  |
    |  +--------------+  +--------------+  +--------------+  |
    |  +--------------+  +--------------+                    |
    |  |  Multer FS   |  |  Socket.io   |                    |
    |  | Media Upload |  | Real-Time WS |                    |
    |  +--------------+  +--------------+                    |
    +-------------------------+------------------------------+
                              |
                              v
              +-------------------------------+
              |     DATABASE LAYER (MongoDB)  |
              |       Mongoose ODM Schemas    |
              +-------------------------------+
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | `^19.2.0` | Declarative UI framework |
| Vite | `^7.2.2` | Lightning-fast bundler & dev server |
| Tailwind CSS | `^4.1.17` | Utility-first styling engine |
| React Router DOM | `^6.30.1` | Client-side page navigation |
| Socket.io Client | `^4.8.3` | Real-time bi-directional room synchronization |
| Axios | `^1.13.6` | HTTP client for backend REST APIs |
| Lucide React | `^0.553.0` | Modern, clean vector icon system |
| Heroicons | `^2.2.0` | Accessible SVG icon suite |
| React Circular Progressbar | `^2.2.0` | Radial Pomodoro countdown graphics |
| `@emailjs/browser` | `^4.4.1` | Client-side email notification integration |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | `24.x` | High-performance asynchronous JavaScript runtime |
| Express | `^5.2.1` | Next-generation web routing & middleware framework |
| Mongoose | `^9.3.3` | Schema-based MongoDB ODM |
| Socket.io | `^4.8.3` | Real-time WebSocket room messaging & events |
| JSONWebToken | `^9.0.3` | Cryptographically signed token authentication |
| Bcrypt.js | `^3.0.3` | Salted password hashing (10 salt rounds) |
| Passport & Google OAuth | `^0.7.0` | Third-party Google identity authentication |
| Helmet | `^8.1.0` | Security-first HTTP headers protection |
| Express Rate Limit | `^8.4.1` | IP-based request throttling against brute force |
| Express Validator | `^7.3.1` | Request schema validation & sanitization |
| Multer | `^2.1.1` | Multipart form-data handling for user avatars & blog covers |
| Nodemailer | `^8.0.4` | SMTP mailer for account verification and password recovery |
| Morgan | `^1.10.1` | HTTP request logger for debugging & audits |

### AI / Computer Vision

| Library | Engine | Role |
|---|---|---|
| `@tensorflow-models/blazeface` | `^0.1.0` | Sub-millisecond face & gaze orientation detector |
| `@tensorflow/tfjs-core` | `^4.22.0` | Client-side tensor computation engine |
| `@tensorflow/tfjs-backend-webgl` | `^4.22.0` | GPU hardware-accelerated WebGL backend for real-time video frames |

### Desktop & Tooling

| Tool / Service | Purpose |
|---|---|
| Electron | `^33.2.1` — Cross-platform desktop runtime |
| `electron-builder` | `^25.1.8` — Windows NSIS Setup installer & Portable `.exe` builder |
| `png-to-ico` | High-fidelity multi-resolution Windows ICO generation |

---

## Directory Structure

```
FocusoraHQ/
+-- backend/                       # Node.js + Express API & WebSocket Server
|   +-- api/                       # Modular route controllers
|   +-- src/
|   |   +-- config/                # DB connection & Passport configuration
|   |   +-- middleware/            # Auth, rate-limiting, and error handlers
|   |   +-- models/                # Mongoose database models (User, Room, Blog, Review)
|   |   +-- routes/                # Endpoint routing definitions
|   |   +-- socket/                # Socket.io room handlers & presence events
|   +-- uploads/                   # User-uploaded profile avatars and blog media
|   +-- seed.js                    # Database seed scripts for test accounts & rooms
|   +-- server.js                  # Backend bootstrap & HTTP/WS server listener
|   +-- package.json
|
+-- frontend/                      # React 19 + Vite + Tailwind CSS Application
|   +-- public/
|   |   +-- animations/            # Lottie productivity & study animations
|   |   +-- images/                # Backgrounds, user avatars, transparent logos
|   +-- src/
|   |   +-- components/            # Reusable UI widgets
|   |   |   +-- Pomodoro.jsx       # Interactive timer with custom cycles
|   |   |   +-- BackgroundSelector # Lo-fi/ambient sound and visual backgrounds
|   |   |   +-- FocusPlaylist.jsx  # Ambient focus tracks & audio player
|   |   |   +-- Notes.jsx          # Markdown scratchpad & notes
|   |   |   +-- Todo.jsx           # Real-time task checklist
|   |   |   +-- ChatWidget.jsx     # In-room chat interface
|   |   +-- context/               # Global state (AuthContext, StudyRoomContext, ThemeContext)
|   |   +-- hooks/                 # Custom React hooks (useSocket, useFirestore)
|   |   +-- pages/                 # Full application views
|   |   |   +-- Home.jsx           # Landing page with feature showcases
|   |   |   +-- StudyRoom.jsx      # Collaborative co-working room with webcam AI detection
|   |   |   +-- MySpace.jsx        # Personalized private study dashboard
|   |   |   +-- Leaderboard.jsx    # Gamified productivity ranking table
|   |   |   +-- Blog.jsx           # Community knowledge base & study guides
|   |   |   +-- Profile.jsx        # Account statistics, streak counter, settings
|   |   +-- App.jsx                # Route hierarchy & persistent layout
|   |   +-- main.jsx               # React DOM entry point
|   +-- vite.config.js             # Vite build & proxy configuration
|   +-- package.json
|
+-- electron/                      # Electron Desktop Packaging
|   +-- main.js                    # Electron main process & child backend spawner
|   +-- preload.js                 # Secure context isolation bridge
|   +-- icon.ico                   # Embedded multi-resolution FocusoraHQ icon
|   +-- release/                   # Packaged binaries (.exe & Setup)
|   +-- package.json
|
+-- .gitignore
+-- README.md
+-- vercel.json
```

---

## Database Schema & Models

Data persistence is managed through **MongoDB** and **Mongoose**.

### 1. `User` Model
Stores profile credentials, gamification stats, and security configurations.
- `username`, `email`, `password` (salted hash)
- `avatar`: URL to custom upload or default avatar
- `studyStreak`: Current consecutive active study days
- `totalStudyMinutes`: Aggregated lifetime focus duration
- `points`: Gamification currency earned through completed focus intervals
- `isEmailVerified`: Verification status flag

### 2. `StudyRoom` Model
Defines persistent and ephemeral virtual study halls.
- `name`, `description`, `category` (STEM, Humanities, Deep Work, Silent Study)
- `host`: Reference to the creating `User`
- `participants`: Active socket participant collection
- `isPrivate`: Access control flag with optional passcode
- `currentPomodoroState`: Shared synchronized timer phase (`WORK`, `SHORT_BREAK`, `LONG_BREAK`)

### 3. `Blog` & `Review` Models
Power user-generated content and platform feedback.
- **Blog**: `title`, `content`, `coverImage`, `author`, `tags`, `clapsCount`
- **Review**: `user`, `rating` (1–5 stars), `comment`, `timestamps`

---

## API Reference

Base Server URL: `http://localhost:5000` (or your deployed server).

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account with hashed password |
| `POST` | `/api/auth/login` | Authenticate with credentials and return JWT |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset link via Nodemailer |
| `POST` | `/api/auth/reset-password` | Reset password using verified reset token |
| `GET` | `/api/auth/google` | Initiate Google OAuth 2.0 flow |

### Study Rooms (`/api/rooms`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | Retrieve all public and active study spaces |
| `POST` | `/api/rooms` | Create a new customized study space |
| `GET` | `/api/rooms/:id` | Get details, active members, and room settings |
| `DELETE` | `/api/rooms/:id` | Host-only termination of a room |

### Community & Gamification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leaderboard` | Get global rankings by focus points & streaks |
| `GET` | `/api/blogs` | Fetch published community study articles |
| `POST` | `/api/blogs` | Publish new blog with uploaded cover image |
| `GET` | `/api/reviews` | Retrieve user reviews and satisfaction score |

---

## AI / ML & Computer Vision Workflows

### Edge BlazeFace Distraction Detection

FocusoraHQ features a **100% private, on-device** computer vision pipeline running directly in the browser via WebGL:

```
Webcam Frame -> HTML5 Video Canvas -> TF.js WebGL Backend
                                              |
                                     BlazeFace Detector
                                              |
                     +------------------------+------------------------+
                     |                                                 |
             Face Detected?                                   Face Orientation
                     |                                                 |
             NO -> Distraction Warning                     Calculates Pitch & Yaw
             (Triggers reminder chime                      (Detects looking away
              & pauses streak points)                       or phone usage)
```

- **Zero Cloud Leakage**: Video frames are analyzed locally in browser memory and are **never** streamed to any server or recorded.
- **Low Compute Overhead**: Sub-30ms inference times leveraging GPU acceleration via `@tensorflow/tfjs-backend-webgl`.

---

## Authentication Flow

```
User Registration / Login
         |
    Credentials Sent -> [Express Rate Limiter]
                               |
                       Bcrypt Validation
                               |
                     Generate JWT (Signed)
                               |
         +---------------------+---------------------+
         |                                           |
   Web Application                             Desktop App
   Stored in HttpOnly Cookie /                 Context Bridge &
   LocalStorage with AuthContext               Session Handshake
```

---

## Environment Configuration

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/focusorahq?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
FRONTEND_URL=http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Local Development Setup

### Prerequisites
- **Node.js** `20.x` or later (tested on Node 24)
- **MongoDB** running locally or a free MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# -> Backend server starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev:csr
# -> Client application runs at http://localhost:5173
```

---

## Desktop App Build (Electron)

FocusoraHQ can be compiled into a standalone Windows desktop executable with embedded branding:

```bash
cd electron

# Install desktop dependencies
npm install

# Test desktop app in development
npm start

# Build Windows Setup installer & standalone portable .exe
npm run dist:all
```

**Artifacts Generated in `electron/release/`:**
- `FocusoraHQ Setup 1.0.0.exe` — Windows NSIS Setup Installer with desktop shortcuts
- `FocusoraHQ 1.0.0.exe` — Standalone portable executable (no install required)

---

## Automated Testing & QA Architecture

FocusoraHQ features a comprehensive, zero-dependency automated unit, integration, and security test suite powered by Node.js's built-in test runner (`node --test`). The suite guarantees complete offline determinism via in-memory ephemeral mocks, ensuring tests run at lightning speed without mutating live databases or consuming external API quotas.

### Running the Test Suite

```bash
# Navigate to the backend directory
cd backend

# Execute the complete automated test suite
npm test
```

### Test Coverage & Suite Breakdown

| Suite / Test File | Focus Areas & Security Controls | Scenarios | Status |
|---|---|:---:|:---:|
| [`tests/auth.test.js`](backend/tests/auth.test.js) | JWT signature verification, token tampering defense, cryptographic expiration (`TokenExpiredError`), bcrypt salt uniqueness, refresh token rotation, token family tracking, replay attack detection, and multi-device FIFO session revocation | 7 | **100% Pass** |
| [`tests/rbac.test.js`](backend/tests/rbac.test.js) | Role-Based Access Control, administrative endpoint defense (HTTP 403 Forbidden), multi-tenant data boundary isolation, and privilege escalation prevention on profile updates | 4 | **100% Pass** |
| [`tests/business_logic.test.js`](backend/tests/business_logic.test.js) | Schema validation constraints, Pomodoro work/break duration limits (min 1, max 60 min), compound participation index uniqueness, timer state machine transitions (`STOPPED` $\rightarrow$ `RUNNING` $\rightarrow$ `PAUSED` $\rightarrow$ `STOPPED`), and gamified streak & focus points math | 4 | **100% Pass** |
| [`tests/security_audit.test.js`](backend/tests/security_audit.test.js) | OWASP defense: Insecure Direct Object References (IDOR), SQL/NoSQL injection prevention (`UNION SELECT`, comment markers, bypasses), XSS sanitization, Anti-Formula Injection (CWE-1236) in CSV exports, and PII redaction from public leaderboards | 5 | **100% Pass** |
| [`tests/api_health.test.js`](backend/tests/api_health.test.js) | Health check endpoint verification, clean JSON 404 responses for unknown routes, and upstream failure resilience (external AI provider timeout fallback to local heuristic) | 3 | **100% Pass** |
| **TOTAL** | **Enterprise Test Suite (Unit, Integration & Security)** | **23** | **23 / 23 (100%)** |

- **Execution Runtime:** ~550 ms
- **External Dependencies:** Zero external test runners required (native `node:test` + `node:assert/strict`)

---

## Security Architecture

| Layer | Mechanism | Protection |
|---|---|---|
| **Rate Limiting** | `express-rate-limit` | Prevents credential stuffing & DDoS |
| **HTTP Headers** | `helmet` | Enforces CSP, HSTS, XSS Filter, Frameguard |
| **Password Security** | `bcryptjs` | Irreversible salted password hashing |
| **Token Authentication** | `jsonwebtoken` | Tamper-proof session validation |
| **Client Vision Privacy** | Client-side TensorFlow | Complete visual privacy (no video leaves machine) |
| **Input Validation** | `express-validator` | Sanitizes query and body parameters |

---

## License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with Focus & Dedication by the **FocusoraHQ Team**

</div>
