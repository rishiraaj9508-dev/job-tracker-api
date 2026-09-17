import "dotenv/config";
import express from "express";
import cors from "cors";


import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorhandling from "./middlewares/errorHandler.js";
import createTables from "./data/createTable.js";




const app = express();

const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// Error handling middleware
app.use(errorhandling);

createTables();
 

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;