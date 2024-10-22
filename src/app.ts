import dotenv from "dotenv";
import express, { Application } from "express";

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

import { createUserTable } from "./models/userModel";
import { createPostTable } from "./models/postModel";
import { createFollowsTable } from "./models/followModel";

dotenv.config();

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Server static files (uploaded files)
app.use("/uploads", express.static("data/uploads"));

// Trust the X-Forwarded-Proto header (HTTPS)
app.set("trust proxy", true);

createUserTable();
createPostTable();
createFollowsTable();

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
