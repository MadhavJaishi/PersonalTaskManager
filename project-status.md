# Project Status & AI Roadmap (`project-status.md`)

## Executive Summary
**PersonalTaskManager (ClearTrack)** is a fully functional, production-refined personal productivity web application. All core features (Authentication, Task Management CRUD, Password Manager, Productivity Analytics Dashboard, Calendar, User Settings) are operational and verified against TypeScript type checking and backend API endpoints.

---

## 1. Feature Status Breakdown

### Completed & Production Ready
- [x] **Email OTP Auth Flow**: Send OTP, verify OTP, session cookies `sb_access`/`sb_refresh`, session rehydration via `/auth/me`.
- [x] **Task Management Core CRUD**: Create task, fetch tasks (with search & priority filters), update task, toggle completion, delete task.
- [x] **Time Tracking**: Target duration vs actual logged time spent editor with debounced update.
- [x] **Password Manager**: Store credentials, live search, copy-to-clipboard, mask/unmask toggle, edit & delete modals.
- [x] **Productivity Analytics Dashboard**: Key metrics (tasks total, completion rate %, logged focus time), priority breakdown chart, progress meters.
- [x] **User Settings**: Profile overview, password change modal, session logout.
- [x] **Navigation & Layout**: Unified header navbar, footer, dynamic routing with authentication guards.

### Partially Implemented / Local State Features
- [!] **Calendar Notes & Day Points**: `Calendar.tsx` manages day and month points in local component state (`useState`) without persisting to backend `/reflections` API.
- [!] **Birthday List**: `BirthdayList.tsx` sorts Hindu calendar birthdays in local state (`useState`) without database persistence.

### Removed Code (Per User Directives)
- [x] **Presets System**: Removed unused preset task functionality (`Presets.tsx` disabled, backend `/presets` route removed).

---

## 2. Technical Debt & Issues Analysis

### Security & Authentication
- **Row Level Security (RLS)**: Database tables rely on `authMiddleware` verification in Express. Enabling native Supabase RLS policies will add an extra layer of defence-in-depth security.
- **Client Credential Storage**: Password Manager stores passwords in plaintext in Supabase `credentials` table. Implementing client-side or server-side AES encryption will improve security.

### Code Hygiene
- **Duplicate Router File**: `backend/routes/calendar/birthdays.js` is an empty 0-byte file.
- **Unused Styling Assets**: `profilePic` references local public relative path `../../../../../public/ProfileImg.jpeg` in `Settings.tsx`.

---

## 3. Prioritized AI Agent Development Roadmap

### High Priority (Immediate Value & Data Integrity)
1. **Persist Calendar Day/Month Notes**:
   - Connect `Calendar.tsx` to `GET /reflections` and `POST /reflections/addReflection` API routes to save day and month notes to PostgreSQL.
2. **Persist Birthday Entries**:
   - Create table `birthdays` in Supabase and wire `BirthdayList.tsx` to backend endpoints so user birthdays persist across sessions.

### Medium Priority (Security & UX Enhancements)
1. **Password Manager Encryption**:
   - Add master-key or AES-256 string encryption for stored credentials in `credentials` table.
2. **Category Filter & Tagging**:
   - Add explicit category filtering pills (Work, Personal, Health, Learning) on the Task List.
3. **Due Date Deadlines & Reminders**:
   - Add date-picker for task due dates and highlight overdue tasks in red on the Dashboard.

### Low Priority (Future Capabilities)
1. **CSV Data Export / Import**:
   - Allow users to export task history and analytics as CSV or JSON files.
2. **Dark Mode Toggle**:
   - Implement theme toggle switcher in `NavBar.tsx` using CSS variables or Tailwind dark mode.
