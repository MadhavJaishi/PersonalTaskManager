# Frontend AI Context & Development Guide (`frontend/skills.md`)

## 1. Technology Stack & Frameworks
- **Core**: React 19 (`react`, `react-dom`)
- **Build Engine**: Vite 7 with `@vitejs/plugin-react`
- **Language**: TypeScript 5 (`~5.8.3`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` v2.9, `react-redux` v9.2)
- **Routing**: React Router DOM v7 (`react-router-dom` v7.8)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `tailwind-scrollbar-hide`)
- **UI & Animations**: Framer Motion (`framer-motion`), React Icons (`react-icons`), Lucide React (`lucide-react`)
- **HTTP Client**: Axios (`axios` v1.11)

---

## 2. Frontend Directory Structure
```
frontend/src/
├── api-config/
│   └── api.ts                 # Axios client instance (baseURL: VITE_BACKEND_URL, withCredentials: true)
├── components/
│   ├── AlertModal.tsx         # Reusable dynamic alert/confirm dialog
│   ├── Footer.tsx             # Application footer
│   ├── Modal.tsx              # Generic modal overlay container (react-modal)
│   ├── NavBar.tsx             # Primary navigation bar with user profile & routes
│   └── modalCss.css           # Modal custom styling
├── pages/
│   ├── Analytics/
│   │   └── Analytics.tsx      # Productivity stats & charts overview page
│   ├── Calendar/
│   │   ├── Calendar.tsx       # Date-fns powered monthly calendar & notes grid
│   │   └── components/
│   │       └── BirthdayList.tsx # Hindu calendar sorted birthday list
│   ├── Dashboard/
│   │   ├── components/
│   │   │   ├── AddTaskModal.tsx    # Modal form for task creation and editing
│   │   │   ├── PriorityTooltip.tsx # Priority filter dropdown selector
│   │   │   ├── QuoteContainer.tsx  # Daily motivational quote container
│   │   │   ├── Routine.tsx         # Daily routine timetable visualization
│   │   │   ├── SearchBar.tsx       # Real-time search query input bar
│   │   │   └── TaskList.tsx        # Grid display of tasks with completion toggles
│   │   ├── redux/
│   │   │   └── tasklist.ts     # TaskList Redux slice & async thunks
│   │   └── Dashboard.tsx       # Main dashboard layout container
│   ├── PasswordManager/
│   │   ├── AddOrEditCredential.tsx # Modal form for password credentials
│   │   ├── CredentialSearch.tsx    # Live credential search input bar
│   │   └── PasswordMgr.tsx         # Password manager table & actions
│   ├── Settings/
│   │   ├── components/
│   │   │   └── Profile.tsx     # Profile avatar & edit section
│   │   └── Settings.tsx       # User account preferences & password update
│   ├── SignIn/
│   │   └── Signin.tsx         # OTP login & verification page
│   └── AppRoutes.tsx          # Central application router & Auth guards
├── redux/
│   ├── store.ts               # Root Redux Toolkit store configuration
│   └── userSlice.ts           # User state slice & localStorage persistence
├── App.tsx                    # Root App component
├── auth.tsx                   # AuthProvider context & hook (`useAuth`)
├── main.tsx                   # React DOM entrypoint
└── vite-env.d.ts              # Vite TypeScript environment declarations
```

---

## 3. Component Architecture & State Management
- **Global State (Redux Toolkit)**:
  - `userSliceReducer`: Stores `id`, `username`, `email`. Synchronized with `localStorage.getItem("user")`.
  - `tasklistSliceReducer`: Stores `tasks[]`, `loading`, `error`. Handles async thunks (`fetchTaskList`, `addTaskAsync`, `updateTask`, `toggleTaskAsync`, `deleteTaskAsync`).
- **Auth Context (`auth.tsx`)**:
  - Exposes `isLoggedIn`, `login()`, `logout()`.
  - Verifies `/auth/me` on mount to maintain cookie session validity.
- **Local Component State**:
  - Modal visibility (`useState(false)`).
  - Search input queries (`searchQuery`).
  - Temporary form fields before submission.

---

## 4. API Communication Pattern
- All HTTP requests **MUST** use the centralized Axios client from `src/api-config/api.ts`.
- **Do not hardcode domain URLs** in components or Redux thunks.
- Example API usage:
```typescript
import { api } from '../../../api-config/api';

// GET request
const response = await api.get('/tasks');

// POST request
const response = await api.post('/tasks/addTask', taskPayload);
```

---

## 5. UI Design Patterns & Styling Conventions
- **Color Palettes & Gradients**:
  - Priority P3 (High): `bg-rose-500/10`, `border-rose-200`, `text-rose-700`
  - Priority P2 (Medium): `bg-amber-500/10`, `border-amber-200`, `text-amber-700`
  - Priority P1 (Low): `bg-blue-500/10`, `border-blue-200`, `text-blue-700`
  - Priority P0 (Background): `bg-slate-500/10`, `border-slate-200`, `text-slate-700`
- **Cards & Container Styling**:
  - Rounded corners: `rounded-2xl`
  - Subtle borders: `border border-slate-200`
  - Soft drop shadows: `shadow-sm hover:shadow-md transition-all`

---

## 6. Form Handling & Validation
- Standard controlled React form inputs (`value={state}`, `onChange={(e) => setState(e.target.value)}`).
- Mandatory validation check before dispatching async actions:
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        setErrorMsg("Title is required");
        return;
    }
    // dispatch action
};
```

---

## 7. Rules AI Agents Must Follow When Editing Frontend Code
1. **Never break Redux state type safety**: Always update `RootState` and `AppDispatch` types in `src/redux/store.ts` if adding a new slice.
2. **Prevent default form behavior**: Always call `e.preventDefault()` inside form submit handlers.
3. **Use relative URLs in Axios calls**: Never append `http://localhost:5432` manually when using `api.get` or `api.post`.
4. **Preserve Responsive Layouts**: Ensure flexbox (`flex-col sm:flex-row`) and grid layouts (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) remain responsive across mobile and desktop.
5. **Always test TypeScript build**: Run `npm run build` in `/frontend` after any code edits.
