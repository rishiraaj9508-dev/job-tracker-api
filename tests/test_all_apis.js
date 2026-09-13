import test, { describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import app from "../src/index.js";
import pool from "../src/config/db.js";

let server;
let baseUrl;

describe("API Test Suite (CRUD, Pagination, Sorting, Filtering)", () => {
    let testUserId;
    let testJobId;
    const testEmail = `test.user.${Date.now()}@example.com`;

    before(async () => {
        // Start server on an ephemeral port (0) to avoid any port conflicts
        await new Promise((resolve) => {
            server = http.createServer(app).listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://localhost:${port}/api`;
                resolve();
            });
        });
    });

    after(async () => {
        // Clean up any test users and jobs
        if (testUserId) {
            await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
        }
        await new Promise((resolve) => server.close(resolve));
        await pool.end();
    });

    // ==========================================
    // USER ENDPOINTS
    // ==========================================
    describe("User APIs", () => {
        test("POST /api/users - Successfully create a user (no password required)", async () => {
            const res = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Test Developer",
                    email: testEmail
                })
            });

            assert.equal(res.status, 201);
            const body = await res.json();
            assert.equal(body.status, 201);
            assert.ok(body.data.id);
            assert.equal(body.data.name, "Test Developer");
            assert.equal(body.data.email, testEmail);

            testUserId = body.data.id;
        });

        test("POST /api/users - Return 400 when name or email is missing", async () => {
            const res = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Incomplete User" })
            });

            assert.equal(res.status, 400);
            const body = await res.json();
            assert.match(body.message, /Name and email are required/i);
        });

        test("POST /api/users - Return 409 when email already exists", async () => {
            const res = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Duplicate User",
                    email: testEmail
                })
            });

            assert.equal(res.status, 409);
            const body = await res.json();
            assert.match(body.message, /Email already exists/i);
        });

        test("GET /api/users - Fetch paginated users with pagination metadata", async () => {
            const res = await fetch(`${baseUrl}/users?page=1&limit=3`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(Array.isArray(body.data));
            assert.ok(body.pagination);
            assert.equal(body.pagination.page, 1);
            assert.equal(body.pagination.limit, 3);
            assert.ok(body.pagination.totalUsers >= 1);
        });

        test("GET /api/users - Filter users by search term", async () => {
            const res = await fetch(`${baseUrl}/users?search=Test%20Developer`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(body.data.some(u => u.id === testUserId));
        });

        test("GET /api/users - Sort users by name descending", async () => {
            const res = await fetch(`${baseUrl}/users?sort_by=name&sort_order=desc`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(Array.isArray(body.data));
            if (body.data.length > 1) {
                assert.ok(body.data[0].name >= body.data[1].name);
            }
        });

        test("GET /api/users/:id - Fetch user by valid ID", async () => {
            const res = await fetch(`${baseUrl}/users/${testUserId}`);
            assert.equal(res.status, 200);
            const body = await res.json();
            assert.equal(body.data.id, testUserId);
            assert.equal(body.data.email, testEmail);
        });

        test("GET /api/users/:id - Return 400 for non-numeric ID", async () => {
            const res = await fetch(`${baseUrl}/users/invalid_id`);
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.match(body.message, /Invalid ID format/i);
        });

        test("GET /api/users/:id - Return 404 for non-existent ID", async () => {
            const res = await fetch(`${baseUrl}/users/999999`);
            assert.equal(res.status, 404);
            const body = await res.json();
            assert.match(body.message, /User not found/i);
        });

        test("PUT /api/users/:id - Update user successfully", async () => {
            const updatedEmail = `updated.${Date.now()}@example.com`;
            const res = await fetch(`${baseUrl}/users/${testUserId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Updated Developer",
                    email: updatedEmail
                })
            });

            assert.equal(res.status, 200);
            const body = await res.json();
            assert.equal(body.data.name, "Updated Developer");
            assert.equal(body.data.email, updatedEmail);
        });
    });

    // ==========================================
    // JOB ENDPOINTS
    // ==========================================
    describe("Job APIs", () => {
        test("POST /api/jobs - Successfully create a job linked to test user", async () => {
            const res = await fetch(`${baseUrl}/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: testUserId,
                    job_title: "Automated QA Specialist",
                    company: "DeepMind",
                    location: "London / Remote",
                    job_type: "Full-time",
                    work_mode: "Remote",
                    salary_min: 3000000,
                    salary_max: 4500000,
                    application_status: "Interview",
                    notes: "Automated integration testing notes"
                })
            });

            assert.equal(res.status, 201);
            const body = await res.json();
            assert.ok(body.data.id);
            assert.equal(body.data.job_title, "Automated QA Specialist");
            assert.equal(body.data.company, "DeepMind");
            assert.equal(body.data.user_id, testUserId);

            testJobId = body.data.id;
        });

        test("POST /api/jobs - Return 400 when required fields missing", async () => {
            const res = await fetch(`${baseUrl}/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: testUserId
                    // missing job_title and company
                })
            });

            assert.equal(res.status, 400);
        });

        test("POST /api/jobs - Return 404 if user_id does not exist", async () => {
            const res = await fetch(`${baseUrl}/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 888888,
                    job_title: "Staff Engineer",
                    company: "OpenAI"
                })
            });

            assert.equal(res.status, 404);
            const body = await res.json();
            assert.match(body.message, /User does not exist/i);
        });

        test("GET /api/jobs - Fetch paginated jobs with pagination metadata", async () => {
            const res = await fetch(`${baseUrl}/jobs?page=1&limit=4`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(Array.isArray(body.data));
            assert.ok(body.pagination);
            assert.equal(body.pagination.page, 1);
            assert.equal(body.pagination.limit, 4);
            assert.ok(body.pagination.totalJobs >= 1);
        });

        test("GET /api/jobs - Filter jobs by status and search", async () => {
            const res = await fetch(`${baseUrl}/jobs?status=Interview&search=DeepMind`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(body.data.some(j => j.id === testJobId));
        });

        test("GET /api/jobs - Filter jobs by work_mode", async () => {
            const res = await fetch(`${baseUrl}/jobs?work_mode=Remote`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(body.data.every(j => j.work_mode === "Remote"));
        });

        test("GET /api/jobs - Sort jobs by salary_max descending", async () => {
            const res = await fetch(`${baseUrl}/jobs?sort_by=salary_max&sort_order=desc`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(Array.isArray(body.data));
            if (body.data.length > 1 && body.data[0].salary_max && body.data[1].salary_max) {
                assert.ok(body.data[0].salary_max >= body.data[1].salary_max);
            }
        });

        test("GET /api/jobs/:id - Fetch job by ID", async () => {
            const res = await fetch(`${baseUrl}/jobs/${testJobId}`);
            assert.equal(res.status, 200);
            const body = await res.json();
            assert.equal(body.data.id, testJobId);
            assert.equal(body.data.job_title, "Automated QA Specialist");
        });

        test("GET /api/users/:userId/jobs - Fetch jobs for specific user", async () => {
            const res = await fetch(`${baseUrl}/users/${testUserId}/jobs`);
            assert.equal(res.status, 200);
            const body = await res.json();

            assert.ok(Array.isArray(body.data));
            assert.ok(body.data.some(j => j.id === testJobId));
            assert.ok(body.data.every(j => j.user_id === testUserId));
        });

        test("PUT /api/jobs/:id - Update job application status and notes", async () => {
            const res = await fetch(`${baseUrl}/jobs/${testJobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_title: "Automated QA Lead",
                    company: "DeepMind",
                    application_status: "Offer",
                    notes: "Offer accepted!"
                })
            });

            assert.equal(res.status, 200);
            const body = await res.json();
            assert.equal(body.data.application_status, "Offer");
            assert.equal(body.data.job_title, "Automated QA Lead");
        });

        test("DELETE /api/jobs/:id - Delete job application", async () => {
            const res = await fetch(`${baseUrl}/jobs/${testJobId}`, { method: "DELETE" });
            assert.equal(res.status, 200);

            // Verify it's gone
            const getRes = await fetch(`${baseUrl}/jobs/${testJobId}`);
            assert.equal(getRes.status, 404);
        });

        test("DELETE /api/users/:id - Delete user", async () => {
            const res = await fetch(`${baseUrl}/users/${testUserId}`, { method: "DELETE" });
            assert.equal(res.status, 200);

            // Verify it's gone
            const getRes = await fetch(`${baseUrl}/users/${testUserId}`);
            assert.equal(getRes.status, 404);
            testUserId = null; // Cleared so after() doesn't need to re-delete
        });
    });
});
