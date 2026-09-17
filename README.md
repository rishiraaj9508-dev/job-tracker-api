# 🚀 Node.js CRUD API, Authentication & Job Tracker Dashboard

A full-stack RESTful API and interactive dashboard built with **Node.js**, **Express.js**, and **PostgreSQL**. The application implements a clean **3-tier architecture (Repository &rarr; Service &rarr; Controller &rarr; Routes &rarr; Middleware)** and features session-based authentication with secure HTTP-only cookies, input validation using Joi, server-side pagination, sorting, filtering, and a modern Tailwind CSS frontend.

---

## 🌟 Key Features

- **Authentication System**:
  - **Password Hashing**: Passwords salted and hashed with `bcrypt`.
  - **Session Management**: Opaque UUIDv4 session tokens stored in PostgreSQL `sessions` table.
  - **HTTP-only Cookies**: Immune to client-side XSS cookie theft.
  - **Session Expiry**: Sessions expire after 7 days and are cleaned up on invalidation or logout.
- **Input Validation**: Request validation powered by `joi` for signup and login endpoints.
- **Users Management**: Create, read, update, and delete user profiles.
- **Job Applications Tracker**: Track job applications with fields like job title, company, work mode, job type, salary range, application status, interview dates, and notes.
- **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` (deleting a user removes all their job applications and active sessions).
- **Advanced Querying**:
  - **Pagination**: Configurable `page` and `limit` with metadata (`total`, `totalPages`).
  - **Sorting**: Whitelisted sort columns and order (`ASC`/`DESC`).
  - **Filtering & Search**: Case-insensitive text search and status/work-mode filters.
- **Frontend Dashboard & Auth Pages**:
  - Built-in stylish dashboard (`/` or `/index.html`) using Tailwind CSS.
  - Dedicated Sign In page (`/login.html`).
  - Dedicated Sign Up page (`/signup.html`).
- **Database Seeding**: Ready-to-run `seed.sql` for pgAdmin Query Tool or via `npm run seed`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Database Driver**: `pg` (node-postgres with Connection Pooling)
- **Security & Auth**: `bcrypt`, `uuid`, `cookie-parser`
- **Validation**: `joi`
- **Environment Management**: `dotenv`
- **Frontend**: HTML5, Tailwind CSS (CDN), FontAwesome
- **Development Tooling**: `nodemon`

---

## 📁 Standard Project Structure

```text
node_crud/
├── public/
│   ├── index.html            # Main Job Tracker Dashboard & playground
│   ├── login.html            # User Sign In page
│   └── signup.html           # User Registration page
├── src/
│   ├── config/
│   │   └── db.js             # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js # Auth request handlers (login, signup, logout)
│   │   └── userController.js # Users & Jobs CRUD request handlers
│   ├── data/
│   │   ├── createTable.js    # Schema migrations (users, jobs, sessions)
│   │   ├── seed.js           # Node script for database seeding
│   │   └── seed.sql          # pgAdmin-ready SQL seed query
│   ├── middlewares/
│   │   ├── authValidation.js # Joi schemas for input validation
│   │   ├── errorHandler.js   # Global error handling middleware
│   │   └── requireAuth.js    # Protected route middleware (session check)
│   ├── models/
│   │   └── userModels.js     # SQL queries for Users and Jobs
│   ├── repositories/
│   │   └── authRepository.js # Database access layer for Auth & Sessions
│   ├── routes/
│   │   ├── authRoutes.js     # Auth route definitions (/api/auth)
│   │   └── userRoutes.js     # User & Job route definitions (/api)
│   ├── services/
│   │   └── authService.js    # Business logic & password hashing
│   └── index.js              # Express app entry point
├── tests/
│   └── test_all_apis.js      # Automated test suite
├── .env                      # Database credentials & port
├── package.json              # NPM scripts and dependencies
└── README.md                 # Project documentation
```

---

## ⚙️ Prerequisites & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) running locally or in cloud
- [pgAdmin](https://www.pgadmin.org/) (optional)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Verify your `.env` file in the project root:
```env
PORT=5001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mydatabase123
DB_PASSWORD="your_database_password"
DB_PORT=5432
```

---

## 🗄️ Database Setup & Seeding

### Automatic Table Initialization
Starting the server automatically runs `createTables()` which creates or updates:
1. `users`: with `id`, `name`, `email`, `password_hash`, `created_at`.
2. `sessions`: with `id`, `user_id`, `expires_at`, `created_at`.
3. `jobs`: with relational constraints referencing `users(id)`.

### Seeding Test Data

#### Option A: Terminal
```bash
npm run seed
```

#### Option B: pgAdmin
1. Open **pgAdmin** and connect to your database (`mydatabase123`).
2. Open the **Query Tool** on your database.
3. Open or paste `src/data/seed.sql` and press **F5**.

> **Default Seed Password**: All sample users (`aarav.sharma@example.com`, etc.) are seeded with password: `Password123!`.

---

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```

The server starts on `http://localhost:5001`.

### Access the Frontend
- **Main Dashboard**: [http://localhost:5001](http://localhost:5001)
- **Sign In**: [http://localhost:5001/login.html](http://localhost:5001/login.html)
- **Sign Up**: [http://localhost:5001/signup.html](http://localhost:5001/signup.html)

---

## 📖 REST API Documentation

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user (`name`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Authenticate user, sets HTTP-only session cookie | Public |
| `POST` | `/api/auth/logout` | Invalidate session in DB and clear cookie | Authenticated |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Authenticated |

#### Example: Signup Request (`POST /api/auth/signup`)
```json
{
  "name": "Rishi Kumar",
  "email": "rishi@example.com",
  "password": "SecurePassword123!"
}
```

#### Example: Login Request (`POST /api/auth/login`)
```json
{
  "email": "rishi@example.com",
  "password": "SecurePassword123!"
}
```
**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Rishi Kumar",
    "email": "rishi@example.com"
  }
}
```
*Sets cookie:* `session_id=<UUID>; HttpOnly; SameSite=Lax; Max-Age=604800`

---

### 👤 User Endpoints (`/api/users`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Create user directly |
| `GET` | `/api/users` | Fetch paginated users (`page`, `limit`, `search`, `sort_by`, `sort_order`) |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user details |
| `DELETE` | `/api/users/:id` | Delete user (cascades to jobs & sessions) |
| `GET` | `/api/users/:userId/jobs` | Fetch all jobs for a specific user |

---

### 💼 Job Endpoints (`/api/jobs`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Create a job application linked to a `user_id` |
| `GET` | `/api/jobs` | Fetch paginated jobs with multi-field filters |
| `GET` | `/api/jobs/:id` | Get job application by ID |
| `PUT` | `/api/jobs/:id` | Update job application details |
| `DELETE` | `/api/jobs/:id` | Delete job application |

#### Query Parameters for Jobs (`GET /api/jobs`)
- `page`, `limit` (pagination)
- `search` (searches title, company, location)
- `status` (`Saved`, `Applied`, `Interview`, `Technical Round`, `Offer`, `Rejected`, `Withdrawn`)
- `work_mode` (`Remote`, `Hybrid`, `On-site`)
- `job_type` (`Full-time`, `Part-time`, `Internship`, `Contract`, `Freelance`)
- `sort_by` (`id`, `salary_max`, `job_title`, etc.), `sort_order` (`asc`/`desc`)

---

## 🧪 Testing

Run the automated test suite:
```bash
npm test
```

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
