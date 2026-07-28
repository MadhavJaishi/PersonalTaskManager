# Comprehensive Architecture Guide (`architecture.md`)

## 1. System Overview

**PersonalTaskManager (ClearTrack)** follows a decoupled single-page application (SPA) architecture:
- **Frontend Layer**: React 19 + TypeScript SPA built with Vite. State is managed via Redux Toolkit slices and React Context (`AuthContext`).
- **Backend Layer**: Express.js server providing RESTful JSON APIs. Manages authentication, business logic validation, CORS headers, and cookie-based JWT session handling.
- **Database & Auth Layer**: Supabase PostgreSQL database managed via Supabase JS Client (`@supabase/supabase-js`).

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND SPA                                    │
│  React 19 + Redux Toolkit + React Router v7 + Tailwind CSS (Port 5173)         │
│                                                                                 │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────────────────┐  │
│  │ AppRoutes Guard│ ──► │  Pages / Views │ ──► │ Redux Slices / AuthContext │  │
│  └────────────────┘     └────────────────┘     └──────────────┬─────────────┘  │
└───────────────────────────────────────────────────────────────┼─────────────────┘
                                                                │ Axios (withCredentials: true)
                                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                BACKEND SERVICE                                  │
│  Express.js Server (Port 5432)                                                  │
│                                                                                 │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────────────────┐  │
│  │ CORS / Cookies │ ──► │ authMiddleware │ ──► │ Controllers / Express Router│  │
│  └────────────────┘     └────────────────┘     └──────────────┬─────────────┘  │
└───────────────────────────────────────────────────────────────┼─────────────────┘
                                                                │ Supabase JS SDK
                                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE POSTGRES DB                                 │
│  Tables: users | tasks | credentials | reflections | timelogs                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. End-to-End Request Lifecycle

```
[User Action in UI]
       │
       ▼
[Component Event Handler]
       │
       ▼
[Redux Async Thunk / API Call] (src/api-config/api.ts)
       │ HTTP Request + Cookie (sb_access)
       ▼
[Express Server Middleware] (src/app.js)
       │ CORS & Cookie Parser
       ▼
[authMiddleware Verification] (routes/middlewares/authMiddleware.js)
       │ Validate JWT with Supabase -> Attach req.user
       ▼
[Express Route Handler] (routes/taskManager/tasks.js, etc.)
       │ SQL Execution via Supabase Client
       ▼
[Supabase PostgreSQL Database]
       │ JSON Result / Row Data
       ▼
[Express HTTP Response] (HTTP 200 OK)
       │
       ▼
[Redux Reducer / React State Update] -> UI Re-renders automatically
```

---

## 4. Authentication & Session Flow

1. **OTP Request**:
   - User enters email in `Signin.tsx`.
   - Client sends `POST /auth/send-otp` with `{ email }`.
   - Backend calls `supabase.auth.signInWithOtp({ email })`.

2. **OTP Verification**:
   - User enters 6-digit OTP code.
   - Client sends `POST /auth/verify-otp` with `{ email, otptoken }`.
   - Supabase verifies code and returns `{ user, session }`.
   - Backend upserts user into `users` table and sets HTTP-Only cookies `sb_access` (max age 4h) and `sb_refresh` (max age 30 days).

3. **Session Rehydration**:
   - On initial application load, `AuthProvider` calls `GET /auth/me`.
   - `authMiddleware` validates `sb_access` cookie via `supabase.auth.getUser()`.
   - If valid, returns `{ user }` object and restores logged-in state without requiring credentials.

4. **Logout**:
   - User clicks **Log Out** in `Settings.tsx`.
   - Client calls `POST /auth/logout`.
   - Backend clears cookies `sb_access` and `sb_refresh`.

---

## 5. Database Relationships & Schemas

```
                 ┌──────────────────┐
                 │      users       │
                 │ ──────────────── │
                 │ id (UUID, PK)    │
                 │ email            │
                 │ username         │
                 └────────┬─────────┘
                          │
         ┌────────────────┼────────────────┬────────────────┐
         │ 1:N            │ 1:N            │ 1:N            │ 1:N
         ▼                ▼                ▼                ▼
┌─────────────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────────┐
│      tasks      │ │credentials│ │ reflections  │ │   timelogs   │
│ ─────────────── │ │───────────│ │──────────────│ │──────────────│
│ id (PK)         │ │id (PK)    │ │id (PK)       │ │id (PK)       │
│ user_id (FK)    │ │user_id(FK)│ │user_id (FK)  │ │user_id (FK)  │
│ title           │ │app        │ │content       │ │task_id (FK)  │
│ description     │ │username   │ │mood          │ │start_time    │
│ targetDuration  │ │password   │ │date          │ │end_time      │
│ timeSpent       │ └───────────┘ └──────────────┘ │total_time    │
│ priority        │                                └──────────────┘
│ is_completed    │
└─────────────────┘
```

---

## 6. How New Features Should Be Added

1. **Database Layer**: Create or alter table schema in Supabase Cloud console.
2. **Backend Route**:
   - Add new route module in `backend/routes/<feature_domain>/<feature_name>.js`.
   - Mount router in `backend/src/app.js` with `authMiddleware`.
3. **Frontend API & Redux**:
   - Define TypeScript interfaces for feature data in `frontend/src/pages/<Feature>/redux/<feature>.ts`.
   - Add async thunks calling `api.get` / `api.post`.
   - Register new slice reducer in `frontend/src/redux/store.ts`.
4. **Frontend View**:
   - Build React components inside `frontend/src/pages/<Feature>/`.
   - Add route definition to `frontend/src/pages/AppRoutes.tsx`.
   - Add navigation entry in `frontend/src/components/NavBar.tsx`.
5. **Verification**: Run `npm run build` in `frontend` and verify type correctness.
