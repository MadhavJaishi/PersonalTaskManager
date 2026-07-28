# API Documentation (`api-docs.md`)

## Base URL
- Development: `http://localhost:5432`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/send-otp`
- **Purpose**: Send a one-time password (OTP) email for login or signup.
- **Auth Required**: No
- **Request Body**:
  ```json
  { "email": "user@example.com" }
  ```
- **Response Format**:
  ```json
  { "ok": true }
  ```
- **Possible Errors**: `400 Bad Request` (`{ "error": "Invalid email format" }`)

### `POST /auth/verify-otp`
- **Purpose**: Verify email OTP token, log in user, and set HTTP-only cookies (`sb_access`, `sb_refresh`).
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otptoken": "123456"
  }
  ```
- **Response Format**:
  ```json
  {
    "ok": true,
    "user": { "id": "uuid-v4", "email": "user@example.com" }
  }
  ```
- **Possible Errors**: `400 Bad Request` (`{ "error": "Token has expired or is invalid" }`)

### `GET /auth/me`
- **Purpose**: Retrieve currently authenticated user context from session cookie.
- **Auth Required**: Yes (Cookies `sb_access` / `sb_refresh`)
- **Response Format**:
  ```json
  {
    "user": { "id": "uuid-v4", "email": "user@example.com" }
  }
  ```
- **Possible Errors**: `401 Unauthorized` (`{ "error": "Not Authenticated" }`)

### `POST /auth/logout`
- **Purpose**: Log out user and clear authentication cookies.
- **Auth Required**: No
- **Response Format**:
  ```json
  { "ok": true }
  ```

---

## 2. Task Management Endpoints (`/tasks`)

### `POST /tasks/addTask`
- **Purpose**: Create a new task.
- **Auth Required**: Yes (`authMiddleware`)
- **Request Body**:
  ```json
  {
    "user_id": "uuid-v4",
    "title": "Complete quarterly report",
    "description": "Draft executive summary and financial tables",
    "notes": "Double check math",
    "targetDuration": 3600,
    "priority": "3",
    "category": "Work"
  }
  ```
- **Response Format**: Task object JSON:
  ```json
  {
    "id": 1,
    "user_id": "uuid-v4",
    "title": "Complete quarterly report",
    "description": "Draft executive summary and financial tables",
    "notes": "Double check math",
    "targetDuration": 3600,
    "timeSpent": 0,
    "priority": "3",
    "is_completed": false,
    "category": "Work",
    "created_at": "2026-07-28T09:47:00.000Z"
  }
  ```
- **Possible Errors**: `400 Bad Request` (`{ "error": "Task title is required" }`)

### `GET /tasks` or `GET /tasks/:user_id`
- **Purpose**: Fetch all tasks for the user.
- **Auth Required**: Yes (`authMiddleware`)
- **Query Parameters**:
  - `search` (string, optional): Search keyword matching task title.
  - `priority` (string, optional): Priority level filter (`0`, `1`, `2`, `3`).
  - `completed` (boolean, optional): Completion status filter (`true`, `false`).
- **Response Format**: Array of task objects:
  ```json
  [
    { "id": 1, "title": "Complete report", "is_completed": false, "priority": "3" }
  ]
  ```

### `GET /tasks/today` or `GET /tasks/today/:user_id`
- **Purpose**: Fetch tasks created today.
- **Auth Required**: Yes (`authMiddleware`)
- **Response Format**: Array of task objects created between 00:00:00 and 23:59:59 today.

### `PUT /tasks/:id`
- **Purpose**: Update task fields.
- **Auth Required**: Yes (`authMiddleware`)
- **Path Parameter**: `id` (integer/string)
- **Request Body**: Fields to update (`title`, `description`, `notes`, `targetDuration`, `timeSpent`, `priority`, `is_completed`, `category`).
- **Response Format**: Updated task object JSON.

### `PATCH /tasks/:id/toggle`
- **Purpose**: Toggle task completion status (`is_completed`).
- **Auth Required**: Yes (`authMiddleware`)
- **Path Parameter**: `id` (integer/string)
- **Response Format**: Updated task object JSON with inverted `is_completed` state.

### `DELETE /tasks/:id`
- **Purpose**: Delete task by ID.
- **Auth Required**: Yes (`authMiddleware`)
- **Path Parameter**: `id` (integer/string)
- **Response Format**:
  ```json
  { "success": true, "message": "Task deleted successfully", "id": "1" }
  ```

---

## 3. Password Manager Endpoints (`/credentials`)

### `GET /credentials` or `GET /credentials/:user_id`
- **Purpose**: Fetch stored credentials for authenticated user.
- **Auth Required**: Yes (`authMiddleware`)
- **Response Format**: Array of credential objects:
  ```json
  [
    { "id": 1, "app": "Gmail", "username": "user@gmail.com", "password": "secretpassword" }
  ]
  ```

### `POST /credentials/addCredential`
- **Purpose**: Store new application credential.
- **Auth Required**: Yes (`authMiddleware`)
- **Request Body**:
  ```json
  { "app": "GitHub", "username": "user", "password": "securepassword" }
  ```
- **Response Format**: Inserted credential object JSON.

### `PUT /credentials/editCredential/:id`
- **Purpose**: Edit stored credential details.
- **Auth Required**: Yes (`authMiddleware`)
- **Path Parameter**: `id` (integer/string)
- **Request Body**: `{ "app": "GitHub", "username": "new_user", "password": "new_password" }`.
- **Response Format**: Updated credential object JSON.

### `DELETE /credentials/deleteCredential/:id`
- **Purpose**: Delete credential by ID.
- **Auth Required**: Yes (`authMiddleware`)
- **Path Parameter**: `id` (integer/string)
- **Response Format**:
  ```json
  { "success": true, "message": "Credential deleted successfully", "id": "1" }
  ```

---

## 4. Reflections & Notes Endpoints (`/reflections`)

### `GET /reflections`
- **Purpose**: Retrieve daily/monthly reflection notes.
- **Auth Required**: Yes (`authMiddleware`)

### `POST /reflections/addReflection`
- **Purpose**: Add reflection note.
- **Auth Required**: Yes (`authMiddleware`)
- **Request Body**:
  ```json
  { "content": "Productive day working on ClearTrack", "mood": "focused", "date": "2026-07-28" }
  ```

---

## 5. Daily Quote Endpoint (`/quotes`)

### `GET /quotes/quoteOfTheDay`
- **Purpose**: Retrieve daily motivational quote (caches random quote per calendar day).
- **Auth Required**: No
- **Response Format**:
  ```json
  {
    "quote": {
      "quote": "The secret of getting ahead is getting started.",
      "author": "Mark Twain"
    }
  }
  ```
