import "dotenv/config";
import express from "express";
import cors from "cors";


import UserRoutes from "./route/UserRoutes.js";
import errorhandling from "./middlewares/errorHandler.js";
import createTables from "./data/createTable.js";




const app = express();

const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Routes
app.use("/api", UserRoutes);

// Error handling middleware
app.use(errorhandling);

createTables();
 

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;