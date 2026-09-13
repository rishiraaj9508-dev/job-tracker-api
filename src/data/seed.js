import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
    try {
        console.log("Reading seed.sql...");
        const sqlPath = path.join(__dirname, "seed.sql");
        const sql = fs.readFileSync(sqlPath, "utf-8");

        console.log("Connecting to PostgreSQL and executing seed script...");
        await pool.query(sql);

        const usersCount = await pool.query("SELECT COUNT(*) FROM users");
        const jobsCount = await pool.query("SELECT COUNT(*) FROM jobs");

        console.log("✅ Seed completed successfully!");
        console.log(`📊 Users in database: ${usersCount.rows[0].count}`);
        console.log(`📊 Jobs in database: ${jobsCount.rows[0].count}`);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        await pool.end();
        process.exit(1);
    }
}

runSeed();
