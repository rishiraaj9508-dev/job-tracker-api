# 🚀 Node.js CRUD API & Job Tracker Dashboard

A full-stack RESTful API and interactive dashboard built with **Node.js**, **Express.js**, and **PostgreSQL**. This application allows users to manage user profiles and track job applications with support for server-side **pagination**, **sorting**, and **filtering**.

---

## 🌟 Key Features

- **Users Management**: Create, read, update, and delete user profiles (Name & Email).
- **Job Applications Tracker**: Track job applications with fields like job title, company, work mode, job type, salary range, application status, interview dates, and notes.
- **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` (deleting a user cascades to all their job applications).
- **Advanced Querying**:
  - **Pagination**: Configurable `page` and `limit` with metadata (`total`, `totalPages`).
  - **Sorting**: Whitelisted sort columns and order (`ASC`/`DESC`).
  - **Filtering & Search**: Case-insensitive text search and status/work-mode filters.
- **Interactive UI Playground**: Built-in stylish single-page dashboard served directly at `http://localhost:5001` using Tailwind CSS.
- **Database Seeding**: Ready-to-run `seed.sql` for pgAdmin Query Tool or via `npm run seed`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Database Driver**: `pg` (node-postgres with Connection Pooling)
- **Environment Management**: `dotenv`
- **Frontend**: HTML5, Tailwind CSS (CDN), FontAwesome
- **Development Tooling**: `nodemon`

---

## 📁 Project Structure

```text
node_crud/
├── public/
│   └── index.html          # Interactive Tailwind CSS dashboard
├── src/
│   ├── config/
│   │   └── db.js           # PostgreSQL pool configuration
│   ├── controller/
│   │   └── userController.js # Request handlers & parameter validation
│   ├── data/
│   │   ├── createTable.js  # Table initialization scripts
│   │   ├── seed.sql        # pgAdmin-ready seed queries
│   │   └── seed.js         # Node script for database seeding
│   ├── middlewares/
│   │   └── errorHandler.js # Global error handler
│   ├── models/
│   │   └── userModels.js   # SQL queries (CRUD, pagination, filters)
│   ├── route/
│   │   └── UserRoutes.js   # Express route definitions
│   └── index.js            # Express app & static server entry point
├── .env                    # Environment variables (DB credentials, PORT)
├── package.json            # Project dependencies & scripts
└── README.md               # Project documentation
```

---

## ⚙️ Prerequisites & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally or on a cloud provider
- [pgAdmin](https://www.pgadmin.org/) (optional, for manual query inspection)

### 2. Installation
Clone or open the project folder in your terminal:
```bash
npm install
```

### 3. Environment Configuration
Create or verify your `.env` file in the root directory:
```env
PORT=5001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mydatabase123
DB_PASSWORD=your_password_here
DB_PORT=5432
```

---

## 🗄️ Database Setup & Seeding

### Automatic Table Creation
When you start the application, `createTables()` automatically ensures the `users` and `jobs` tables are created in your PostgreSQL database.

### Seeding Sample Data

#### Option 1: Using pgAdmin
1. Open **pgAdmin** and connect to your database (`mydatabase123`).
2. Right-click your database and select **Query Tool**.
3. Open or copy the contents of `src/data/seed.sql`.
4. Press **F5** to execute.

#### Option 2: Using the Terminal
Run the automated seed command:
```bash
npm run seed
```

---

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```

The server will start on:
```text
http://localhost:5001
```

### Access Interactive UI
Open your web browser and navigate to:
👉 **[http://localhost:5001](http://localhost:5001)**

The frontend allows you to:
- Add and edit users without passwords.
- Filter, search, and paginate through users and job applications.
- Add job applications linked to existing users.
- Filter jobs specifically for a selected user with one click.

---

## 📖 REST API Documentation

Base URL: `http://localhost:5001/api`

### 👤 User Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Create a new user (`name`, `email`) |
| `GET` | `/users` | Fetch paginated users (supports `search`, `sort_by`, `sort_order`, `page`, `limit`) |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id` | Update user details (`name`, `email`) |
| `DELETE` | `/users/:id` | Delete user (cascades to their jobs) |
| `GET` | `/users/:userId/jobs` | Fetch all jobs belonging to a specific user |

#### User Query Parameters (`GET /api/users`)
- `page` (default `1`): Current page number.
- `limit` (default `10`): Items per page.
- `sort_by` (default `id`): Sort by `id`, `name`, `email`, or `created_at`.
- `sort_order` (default `asc`): Sort direction (`asc` or `desc`).
- `search` (optional): Filter users where `name` or `email` matches search term.

#### Example Request & Response (`GET /api/users?page=1&limit=2&search=sharma`)
```json
{
  "status": 200,
  "message": "All users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "created_at": "2026-09-12T17:39:46.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "totalUsers": 1,
    "totalPages": 1
  }
}
```

---

### 💼 Job Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/jobs` | Create a new job application |
| `GET` | `/jobs` | Fetch paginated jobs with filters |
| `GET` | `/jobs/:id` | Get job by ID |
| `PUT` | `/jobs/:id` | Update job application details |
| `DELETE` | `/jobs/:id` | Delete job application |

#### Job Query Parameters (`GET /api/jobs`)
- `page` (default `1`): Current page number.
- `limit` (default `10`): Items per page.
- `sort_by` (default `id`): Sort by `id`, `job_title`, `company`, `salary_min`, `salary_max`, `application_status`, or `created_at`.
- `sort_order` (default `desc`): Sort direction (`asc` or `desc`).
- `search` (optional): Case-insensitive search across `job_title`, `company`, and `location`.
- `status` (optional): Filter by `Saved`, `Applied`, `Interview`, `Technical Round`, `Offer`, `Rejected`, `Withdrawn`.
- `work_mode` (optional): Filter by `Remote`, `Hybrid`, `On-site`.
- `job_type` (optional): Filter by `Full-time`, `Part-time`, `Internship`, `Contract`, `Freelance`.
- `user_id` (optional): Filter jobs by applicant user ID.
- `salary_min` / `salary_max` (optional): Filter by salary thresholds.

#### Example Payload (`POST /api/jobs`)
```json
{
  "user_id": 1,
  "job_title": "Full Stack Engineer",
  "company": "Google",
  "location": "Bangalore, India",
  "job_type": "Full-time",
  "work_mode": "Hybrid",
  "salary_min": 2500000,
  "salary_max": 3500000,
  "application_status": "Interview",
  "notes": "Technical round scheduled for next Tuesday."
}
```

---

## 🛡️ Validation & Error Handling

- **Invalid ID Handling**: Requests with non-numeric IDs (e.g., `GET /api/users/abc`) return a clean `400 Bad Request` instead of triggering a database crash.
- **Duplicate Email Prevention**: Unique constraints on emails return a `409 Conflict` status code.
- **Foreign Key Enforcement**: Attempting to link a job to a non-existent `user_id` returns a `404 User does not exist` response.
- **Consistent Response Schema**:
  ```json
  {
    "status": 200,
    "message": "Human-readable message",
    "data": null,
    "pagination": { ... }
  }
  ```

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
