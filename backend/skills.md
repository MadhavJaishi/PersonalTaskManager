# Backend AI Context & Development Guide (`backend/skills.md`)

## 1. Backend Architecture & Technologies
- **Runtime Environment**: Node.js with native ES Modules (`"type": "module"` in `package.json`).
- **Dev Runner**: Nodemon (`nodemon src/app.js` via `npm run dev`).
- **Server Framework**: Express.js (`express` v4.21).
- **Database & Auth SDK**: Supabase JavaScript Client (`@supabase/supabase-js` v2.56).
- **Environment & Utilities**: `dotenv`, `cors`, `cookie-parser`, `axios`.
- **Listening Port**: `5001` (configured via `process.env.PORT` or `.env`).

---

## 2. Directory Structure
```
backend/
├── routes/
│   ├── auth/
│   │   └── auth.js             # Authentication routes (OTP send, verify, me, logout)
│   ├── calendar/
│   │   └── birthdays.js        # Calendar birthdays router placeholder
│   ├── middlewares/
│   │   └── authMiddleware.js   # JWT & cookie session authentication middleware
│   ├── passwordManager/
│   │   └── credentials.js      # Password manager CRUD routes
│   ├── quotes/
│   │   └── quotes.js           # Quote of the day proxy endpoint
│   └── taskManager/
│       ├── presets.js          # Disabled/stubbed route module
│       ├── reflections.js      # Daily/monthly reflections CRUD routes
│       ├── tasks.js            # Task management CRUD routes
│       └── timelogs.js         # Time tracking log insertion routes
├── src/
│   └── app.js                  # Main Express application server entry point
├── utils/
│   └── supabase.js             # Supabase client instantiation module
├── .env                        # Environment variables (PORT, SUPABASE_URL, SERVICE_KEY)
└── package.json                # Project dependencies and script config
```

---

## 3. Middleware & Authentication Flow
- `authMiddleware.js` extracts authentication tokens from:
  1. `req.cookies.sb_access` (Cookie)
  2. `Authorization: Bearer <token>` (HTTP Header)
- Verifies session using `supabase.auth.getUser(access)`.
- If valid, attaches user payload to `req.user` and calls `next()`.
- If expired, attempts to refresh token using `req.cookies.sb_refresh` via `supabase.auth.refreshSession()`.
- Unauthenticated requests return HTTP status `401` (`{ "error": "Not Authenticated" }`).

```javascript
// Express route protection example in app.js
app.use('/tasks', authMiddleware, taskRouter);
app.use('/credentials', authMiddleware, credentialRouter);
```

---

## 4. API Endpoints Map

### Auth Routes (`/auth`)
- `POST /auth/send-otp`: Sends login/signup OTP to specified email.
- `POST /auth/verify-otp`: Verifies OTP token, creates/upserts user row, sets HTTP cookies `sb_access` and `sb_refresh`.
- `GET /auth/me`: Returns currently authenticated user context from cookie token.
- `POST /auth/update-username`: Updates user profile username.
- `POST /auth/logout`: Clears authentication cookies `sb_access` and `sb_refresh`.

### Tasks Routes (`/tasks`) - *Protected*
- `POST /tasks/addTask`: Body `{ title, description, notes, targetDuration, priority, category, due_date }`. Creates a task.
- `GET /tasks/today/:user_id?`: Returns tasks created today.
- `GET /tasks/:user_id?`: Returns all user tasks. Supports query parameters `search`, `priority`, `completed`.
- `PUT /tasks/:id`: Updates fields of task specified by `:id`.
- `PATCH /tasks/:id/toggle`: Toggles `is_completed` boolean status of task.
- `DELETE /tasks/:id`: Deletes task specified by `:id`.

### Password Manager Routes (`/credentials`) - *Protected*
- `GET /credentials/:user_id?`: Fetches all credentials for authenticated user.
- `POST /credentials/addCredential`: Body `{ app, username, password }`. Adds new credential.
- `PUT /credentials/editCredential/:id`: Body `{ app, username, password }`. Updates credential.
- `DELETE /credentials/deleteCredential/:id`: Deletes credential by `:id`.

### Reflections Routes (`/reflections`) - *Protected*
- `POST /reflections/addReflection`: Body `{ content, mood, date }`. Creates reflection.
- `GET /reflections/:user_id?`: Gets reflections list.
- `PUT /reflections/:id`: Updates reflection.
- `DELETE /reflections/:id`: Deletes reflection.

### Quotes Routes (`/quotes`)
- `GET /quotes/quoteOfTheDay`: Fetches random daily motivational quote (caches result daily).

---

## 5. Standard API Response Structure
- **Success Response**: Direct JSON object or array representation:
  ```json
  { "id": 1, "title": "Complete report", "is_completed": false }
  ```
- **Error Response**: JSON object containing `error` message string with HTTP status `400`, `401`, or `500`:
  ```json
  { "error": "Task title is required" }
  ```

---

## 6. Rules AI Agents Must Follow When Editing Backend Code
1. **Always use ES modules**: Use `import`/`export` and include relative file extensions `.js`.
2. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to client**: The service role client must only be initialized in `utils/supabase.js` on the server.
3. **Always use `try...catch` blocks**: Wrap asynchronous Supabase queries inside `try...catch` to prevent unhandled promise rejections.
4. **Extract `user_id` safely**: Prefer `req.user?.id` set by `authMiddleware` over untrusted client parameters.
5. **Verify JavaScript syntax**: Run `node -c src/app.js` after backend modifications.
