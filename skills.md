# PersonalTaskManager Root Development & AI Context Guide

## 1. Project Overview
**PersonalTaskManager** (also named ClearTrack) is a full-stack personal productivity application. It provides users with a comprehensive suite for managing daily tasks, tracking target vs. logged time, analyzing productivity metrics, storing encrypted credentials securely, managing calendar day/month notes, and displaying motivational quotes.

- **Frontend Application**: Vite + React 19 + TypeScript + Redux Toolkit + Tailwind CSS v4 running on `http://localhost:5173`.
- **Backend Service**: Express.js (ES Modules) running on `http://localhost:5432` integrated with Supabase PostgreSQL database & Supabase Auth.

---

## 2. Complete Technology Stack

### Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 7 (`vite`, `@vitejs/plugin-react`)
- **Language**: TypeScript 5 (`typescript`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `tailwind-scrollbar-hide`)
- **Animations & Icons**: Framer Motion (`framer-motion`), Lucide React (`lucide-react`), React Icons (`react-icons`, `md`, `io`, `fa`, `sl`, `tb`, `fi`)
- **Utilities**: `axios`, `date-fns`, `react-modal`

### Backend
- **Runtime**: Node.js (ES module configuration: `"type": "module"`)
- **Framework**: Express.js v4 (`express`)
- **Database & Auth SDK**: Supabase JavaScript SDK (`@supabase/supabase-js`)
- **Middleware & Utilities**: `cors`, `cookie-parser`, `dotenv`, `axios`
- **Database**: Supabase Cloud PostgreSQL DB

---

## 3. High-Level Architecture
```
┌───────────────────────────────────────────────────────────┐
│                      Client Browser                       │
│  React 19 + Redux Toolkit + Tailwind CSS (Port 5173)      │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTP Requests / Cookies
                              ▼
┌───────────────────────────────────────────────────────────┐
│                 Express Backend Service                   │
│           app.use(authMiddleware) (Port 5432)             │
└─────────────────────────────┬─────────────────────────────┘
                              │ Service Role Key / Auth API
                              ▼
┌───────────────────────────────────────────────────────────┐
│                Supabase Cloud PostgreSQL DB               │
│     Tables: users, tasks, reflections, timelogs, etc.     │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Repository Folder Structure
```
PersonalTaskManager/
├── backend/
│   ├── routes/
│   │   ├── auth/
│   │   │   └── auth.js
│   │   ├── calendar/
│   │   │   └── birthdays.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── passwordManager/
│   │   │   └── credentials.js
│   │   ├── quotes/
│   │   │   └── quotes.js
│   │   └── taskManager/
│   │       ├── presets.js (Disabled / stubbed)
│   │       ├── reflections.js
│   │       ├── tasks.js
│   │       └── timelogs.js
│   ├── src/
│   │   └── app.js
│   ├── utils/
│   │   └── supabase.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api-config/
    │   │   └── api.ts
    │   ├── components/
    │   │   ├── AlertModal.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Modal.tsx
    │   │   ├── NavBar.tsx
    │   │   └── modalCss.css
    │   ├── pages/
    │   │   ├── Analytics/
    │   │   │   └── Analytics.tsx
    │   │   ├── Calendar/
    │   │   │   ├── Calendar.tsx
    │   │   │   └── components/
    │   │   │       └── BirthdayList.tsx
    │   │   ├── Dashboard/
    │   │   │   ├── components/
    │   │   │   │   ├── AddTaskModal.tsx
    │   │   │   │   ├── AddTaskOrPreset.tsx
    │   │   │   │   ├── DndProviderWrapper.tsx
    │   │   │   │   ├── Presets.tsx
    │   │   │   │   ├── PriorityTooltip.tsx
    │   │   │   │   ├── QuoteContainer.tsx
    │   │   │   │   ├── Routine.tsx
    │   │   │   │   ├── SearchBar.tsx
    │   │   │   │   └── TaskList.tsx
    │   │   │   ├── redux/
    │   │   │   │   └── tasklist.ts
    │   │   │   └── Dashboard.tsx
    │   │   ├── PasswordManager/
    │   │   │   ├── AddOrEditCredential.tsx
    │   │   │   ├── CredentialSearch.tsx
    │   │   │   └── PasswordMgr.tsx
    │   │   ├── Settings/
    │   │   │   ├── components/
    │   │   │   │   └── Profile.tsx
    │   │   │   └── Settings.tsx
    │   │   ├── SignIn/
    │   │   │   └── Signin.tsx
    │   │   └── AppRoutes.tsx
    │   ├── redux/
    │   │   ├── store.ts
    │   │   └── userSlice.ts
    │   ├── App.tsx
    │   ├── auth.tsx
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── .env
    └── package.json
```

---

## 5. Coding Conventions & Project-Wide Rules
1. **ES Module Imports**: Always use standard `import`/`export` syntax (no `require`/`module.exports`). Include file extensions for relative backend JS imports (`.js`).
2. **TypeScript Strictly Typed**: Frontend components must define explicit interfaces/props. Avoid `any` where possible.
3. **Axios Centralization**: Use the centralized Axios instance exported from `frontend/src/api-config/api.ts`. Pass relative endpoint paths (`/tasks`, `/credentials`) rather than hardcoded domains.
4. **Tailwind CSS Styling**: Utility-first styling with consistent color scheme:
   - Primary Accent: Blue (`bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`)
   - Surface / Background: Light Gray (`bg-[#F9FAFB]`, `bg-white`, `border-slate-200`)
   - Text Colors: Dark Slate (`text-slate-800`, `text-slate-600`, `text-slate-400`)

---

## 6. Naming Conventions
- **React Components**: PascalCase (e.g. `TaskList.tsx`, `AddTaskModal.tsx`).
- **Redux Slices & Utilities**: camelCase (e.g. `tasklist.ts`, `userSlice.ts`, `api.ts`).
- **Backend Routes**: Express Router exported per domain under `routes/<domain>/<resource>.js`.
- **Database Table Columns**: `snake_case` (e.g. `user_id`, `created_at`, `is_completed`, `targetDuration`, `timeSpent`).

---

## 7. AI Instructions for Making Changes
1. **Never guess API endpoints or table columns**: Inspect `backend/routes/` and Supabase query calls before invoking data handlers.
2. **Always test TypeScript build after modifications**: Run `npm run build` in `/frontend`.
3. **Do not create duplicate Axios clients**: Always import `{ api }` from `src/api-config/api.ts`.
4. **Maintain CORS & Authentication headers**: Ensure `withCredentials: true` is preserved on HTTP requests that require session cookie forwarding.
5. **No inline hardcoded hostnames**: Keep API URLs relative (e.g., `/tasks/today`) to allow environment configuration via `VITE_BACKEND_URL`.

---

## 8. Features Currently Implemented
- **User Authentication**: OTP email verification via Supabase Auth (`/auth/send-otp`, `/auth/verify-otp`, `/auth/me`, `/auth/logout`).
- **Task Management**:
  - Full CRUD operations: Create task, fetch tasks, update details, toggle completion status, delete task.
  - Priority levels (`P3`, `P2`, `P1`, `P0`) with gradient card badges.
  - Target duration vs. actual time spent editor.
  - Live title/description search and priority filtering.
- **Password Manager**:
  - Encrypted credential listing, creation, updating, and deletion.
  - Search filter, mask/unmask visibility toggle, and copy-to-clipboard functionality.
- **Productivity Analytics**:
  - Comprehensive metrics overview (Total Tasks, Completion Rate %, Time Spent breakdown, Priority distribution).
- **Calendar & Reflections**:
  - Interactive grid calendar, day/month notes management, Hindu month birthday list display.
- **Settings & User Profile**:
  - User details display, password update form, and logout button.

---

## 9. Known Incomplete Features / Technical Debt
- **Birthdays persistence**: `BirthdayList.tsx` currently stores birthdays in component state (`useState`) without persisting to backend DB.
- **Calendar Day/Month Points persistence**: `Calendar.tsx` stores day & month points in component state instead of calling `/reflections` DB table.
- **`backend/routes/calendar/birthdays.js`**: File is currently empty.

---

## 10. Future Improvement Suggestions
1. **Supabase Row Level Security (RLS)**: Enforce database-level policies on `tasks`, `credentials`, `reflections`, and `timelogs` tables.
2. **Calendar DB Persistence**: Connect `Calendar.tsx` and `BirthdayList.tsx` to `reflections` and `birthdays` backend API routes.
3. **Task Reminders & Notifications**: Implement web browser notifications for upcoming due dates.
