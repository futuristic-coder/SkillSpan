# SkillSpan

> A real-time collaborative coding interview platform with live video, chat, and in-browser code execution.

![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js-3C873A?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)
![Stream](https://img.shields.io/badge/Realtime-Stream-005FFF)

SkillSpan helps candidates and interviewers solve coding problems together in one session room with:
- shared problem context,
- live call + chat,
- multi-language code execution,
- and simple session lifecycle management.

---

## ✨ What’s Already Built

### Product Features
- Clerk authentication with public and protected app routes.
- Dashboard with active sessions, recent sessions, session stats, and create-session flow.
- Problem listing + dedicated problem detail pages.
- Full session workspace including:
  - Monaco editor
  - language switching (`JavaScript`, `Python`, `Java`)
  - run/reset actions
  - custom stdin support + example-based stdin autofill
  - output/error panel
- Real-time communication via Stream Video + Stream Chat.
- Session lifecycle controls:
  - host create/end session
  - participant join session
  - status transitions from `active` to `completed`
  - participant tracking (including per-device lock support in schema)

### Backend
- Express API server with modular route/controller structure.
- MongoDB models for `User` and `Session`.
- Clerk middleware + protected route middleware.
- Session endpoints for create, join, end, active list, recent list, and fetch by id.
- AI custom problem generation endpoint with fallback behavior.
- Stream token endpoint for authenticated users.
- Code execution service (`/api/code/execute`) for:
  - JavaScript (`node`)
  - Python (`python` / `py -3`)
  - Java (`javac` + `java`)
  - execution timeout and runtime error handling
- Inngest workflows for Clerk user sync (create/delete user + Stream sync).

### Frontend
- React + Vite single-page application.
- React Router navigation with Clerk-based route protection.
- TanStack Query for server state and mutations.
- Tailwind-based UI with dark/light themes.
- Reusable dashboard/session UI components.
- API abstraction layer for backend communication.

---

## 🧱 Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- Clerk
- TanStack React Query
- Monaco Editor
- Stream Video + Stream Chat SDKs

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- Clerk Express middleware
- Stream server SDKs
- Inngest

---

## 📁 Project Structure

```text
SkillSpan/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
└── package.json
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DB_URI=your_mongodb_connection_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

GROQ_API_KEY=your_groq_api_key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🚀 Local Setup

### 1) Install dependencies

From the project root:

```bash
npm run build
```

This installs backend + frontend dependencies and builds frontend assets.

### 2) Start backend

```bash
cd backend
npm run dev
```

### 3) Start frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 🛠️ Scripts

**Root**
- `npm run build` → install all dependencies and build frontend
- `npm start` → start backend server

**Backend**
- `npm run dev` → start with nodemon
- `npm start` → start with node

**Frontend**
- `npm run dev` → start Vite dev server
- `npm run build` → production build
- `npm run lint` → run ESLint
- `npm run preview` → preview production build

---

## 📌 Current Status

- Core MVP is implemented end-to-end.
- Auth, session management, live video/chat, and code execution are integrated.
- Frontend linting is passing.

## 🔗 Repository

- GitHub: https://github.com/futuristic-coder/SkillSpan
  
