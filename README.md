# ⚡ TaskFlow — Task Management System

> A full-stack task management application built with Node.js, TypeScript, Prisma, and Next.js. Features JWT authentication with access/refresh token rotation, full CRUD operations, real-time filtering, and a modern glassmorphism UI.

---

## 🔗 Live Demo

https://task-manager-chi-dun.vercel.app/register

---

## 📸 Screenshots

### Login Page
![Login](./screenshots/login.png)


### Register Page
![Register](./screenshots/register.png)


### Dashboard — With Tasks
![Dashboard](./screenshots/dashboard.png)


### Create Task Modal
![New Task](./screenshots/newtask.png)


### Edit Task Modal
![Edit Task](./screenshots/edittask.png)


---

## 🌊 App Flow

```
User visits /
     │
     ▼
Redirected to /login
     │
     ├── New user? → /register → Create account → /dashboard
     │
     └── Existing user? → /login → Enter credentials → /dashboard
                                          │
                                          ▼
                                   Task Dashboard
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                     Create Task     View/Filter      Edit Task
                          │           Tasks              │
                          │               │               │
                     POST /tasks    GET /tasks       PATCH /tasks/:id
                                          │
                                   ┌──────┴──────┐
                               Toggle        Delete
                                  │               │
                         PATCH /tasks/       DELETE /tasks/:id
                           :id/toggle
```

---

## ✨ Features

### Authentication
- 🔐 Secure registration and login with **bcrypt** password hashing
- 🎫 **Dual JWT token system** — short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- 🔄 **Automatic token refresh** — axios interceptor silently refreshes expired access tokens
- 🚪 Logout clears all tokens from localStorage

### Task Management
- ✅ Create tasks with title and optional description
- 📋 View all tasks in a responsive 3-column grid
- ✏️ Edit task title and description inline via modal
- 🗑️ Delete tasks with confirmation
- 🔁 Toggle task status between **Pending** and **Completed**

### Dashboard
- 📊 Real-time stats — Total, Pending, Completed, and Completion %
- 🔍 **Live search** by task title
- 🏷️ **Filter** by status (All / Pending / Completed)
- 📄 **Pagination** — 9 tasks per page
- 👋 Dynamic greeting based on time of day

### UI / UX
- 🌑 Dark glassmorphism theme with purple/blue gradient accents
- 💫 Smooth animations and hover effects on all interactive elements
- 🍞 Toast notifications for all create / update / delete operations
- 📱 Fully responsive — works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | HTTP server and routing |
| **TypeScript** | Type safety throughout the codebase |
| **Prisma ORM** | Database queries and schema management |
| **PostgreSQL** (Neon) | Cloud-hosted SQL database |
| **JSON Web Tokens** | Access token + refresh token auth |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin request handling |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe components and API calls |
| **CSS Modules** | Scoped component styling |
| **Axios** | HTTP client with interceptors |
| **React Hot Toast** | Toast notification system |
| **React Context** | Global auth state management |

---

## 📁 Folder Structure

```
task-manager/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database models (User, Task)
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts # Register, login, refresh, logout logic
│   │   │   └── auth.routes.ts     # Auth route definitions
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts # CRUD + toggle + pagination logic
│   │   │   └── tasks.routes.ts    # Task route definitions
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT verification middleware
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma client instance
│   │   ├── types/
│   │   │   └── index.ts           # AuthRequest interface
│   │   └── index.ts               # Express app entry point
│   ├── .env                       # Environment variables (gitignored)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx   # Login page
    │   │   │   ├── register/
    │   │   │   │   └── page.tsx   # Register page
    │   │   │   ├── auth.module.css
    │   │   │   └── layout.tsx
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx       # Main dashboard page
    │   │   │   └── dashboard.module.css
    │   │   ├── globals.css        # Global styles + font imports
    │   │   ├── layout.tsx         # Root layout with AuthProvider + Toaster
    │   │   └── page.tsx           # Redirects to /login
    │   ├── components/
    │   │   ├── Navbar.tsx         # Top navigation bar
    │   │   ├── Navbar.module.css
    │   │   ├── TaskCard.tsx       # Individual task card component
    │   │   ├── TaskCard.module.css
    │   │   ├── TaskModal.tsx      # Create/Edit task modal
    │   │   └── TaskModal.module.css
    │   ├── context/
    │   │   └── AuthContext.tsx    # Global auth state + logout logic
    │   ├── lib/
    │   │   └── axios.ts           # Axios instance + token interceptors
    │   └── types/
    │       └── index.ts           # Shared TypeScript interfaces
    ├── package.json
    └── tsconfig.json
```

---

## 🔐 Authentication Flow

```
REGISTRATION
─────────────────────────────────────────────────────────
Client          →    POST /auth/register (name, email, password)
Server          →    Hash password with bcrypt
Server          →    Save user to DB
Server          →    Generate accessToken (15min) + refreshToken (7d)
Client          ←    { accessToken, refreshToken, user }
Client          →    Save tokens to localStorage → redirect /dashboard


LOGIN
─────────────────────────────────────────────────────────
Client          →    POST /auth/login (email, password)
Server          →    Find user by email
Server          →    Compare password with bcrypt
Server          →    Generate accessToken + refreshToken
Client          ←    { accessToken, refreshToken, user }
Client          →    Save tokens to localStorage → redirect /dashboard


AUTHENTICATED REQUEST
─────────────────────────────────────────────────────────
Client          →    GET /tasks (Authorization: Bearer <accessToken>)
Middleware      →    Verify accessToken signature + expiry
Server          →    Attach userId to request object
Controller      →    Query DB for user's tasks
Client          ←    { tasks, pagination }


TOKEN REFRESH (automatic via Axios interceptor)
─────────────────────────────────────────────────────────
Client          →    GET /tasks → 401 Unauthorized (token expired)
Interceptor     →    Catch 401 response
Interceptor     →    POST /auth/refresh (refreshToken from localStorage)
Server          →    Verify refreshToken → generate new accessToken
Interceptor     ←    { accessToken }
Interceptor     →    Save new accessToken to localStorage
Interceptor     →    Retry original request with new token
Client          ←    Original response (tasks data)


LOGOUT
─────────────────────────────────────────────────────────
Client          →    POST /auth/logout
Client          →    Remove accessToken, refreshToken, user from localStorage
Client          →    Redirect to /login
```

---

## 📡 API Endpoints

### Auth Routes — `/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/auth/register` | ❌ | `{ name, email, password }` | Register new user |
| POST | `/auth/login` | ❌ | `{ email, password }` | Login, returns tokens |
| POST | `/auth/refresh` | ❌ | `{ refreshToken }` | Get new access token |
| POST | `/auth/logout` | ❌ | — | Logout (client clears tokens) |

### Task Routes — `/tasks`

All task routes require `Authorization: Bearer <accessToken>` header.

| Method | Endpoint | Query Params | Body | Description |
|---|---|---|---|---|
| GET | `/tasks` | `page`, `limit`, `status`, `search` | — | Get all tasks (paginated) |
| POST | `/tasks` | — | `{ title, description? }` | Create new task |
| GET | `/tasks/:id` | — | — | Get single task |
| PATCH | `/tasks/:id` | — | `{ title?, description?, status? }` | Update task |
| DELETE | `/tasks/:id` | — | — | Delete task |
| PATCH | `/tasks/:id/toggle` | — | — | Toggle pending ↔ completed |



---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String                         // bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]                         // one-to-many relation
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?                      // optional
  status      String   @default("pending") // "pending" | "completed"
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Relationships:**
- One `User` has many `Tasks`
- Each `Task` belongs to exactly one `User`
- Deleting a `User` cascades and deletes all their `Tasks`
- Tasks are always filtered by `userId` — users can never see each other's tasks

---



## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+
- A free [Neon](https://neon.tech) PostgreSQL database

---

### 1. Clone the repository

```bash
git clone https://github.com/Apoorv0207/task-manager.git
cd task-manager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_ACCESS_SECRET="your-access-token-secret-here"
JWT_REFRESH_SECRET="your-refresh-token-secret-here"
PORT=5000
```

> Get your `DATABASE_URL` from [neon.tech](https://neon.tech) → Create Project → Connection String

Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at → `http://localhost:3000`

---

### 4. Open the app

Visit `http://localhost:3000` in your browser.

- Register a new account
- You'll be redirected to the dashboard
- Start creating and managing tasks!

---

### Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | backend `.env` | Neon PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | backend `.env` | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | backend `.env` | Secret key for signing refresh tokens |
| `PORT` | backend `.env` | Port for Express server (default: 5000) |

---

## 🚀 Build for Production

**Backend:**
```bash
cd backend
npm run build        # Compiles TypeScript to /dist
npm start            # Runs compiled JS
```

**Frontend:**
```bash
cd frontend
npm run build        # Creates optimized Next.js build
npm start            # Runs production server
```

---

## 📋 API Testing

Import the following into **Thunder Client** or **Postman** to test all endpoints.

All task routes need this header:
```
Authorization: Bearer <your-access-token>
```

Test order:
1. `POST /auth/register` — create account, copy `accessToken`
2. `POST /tasks` — create a task, copy task `id`
3. `GET /tasks` — see all tasks with pagination
4. `GET /tasks?status=pending` — filter by status
5. `GET /tasks?search=keyword` — search by title
6. `PATCH /tasks/:id` — update task
7. `PATCH /tasks/:id/toggle` — toggle status
8. `DELETE /tasks/:id` — delete task
9. `POST /auth/refresh` — get new access token using refresh token
10. `POST /auth/logout` — logout

---

## 👨‍💻 Author

**Apoorv Gautam**
- GitHub: (https://github.com/Apoorv0207)
- Email: apoorvgtm@gmail.com

---

