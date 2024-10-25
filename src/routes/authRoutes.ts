import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  protectedRoute,
} from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Route for refreshing access token
router.post("/refresh-token", refreshToken);

// Protected route (requires JWT)
router.get("/protected", authenticateJWT, protectedRoute);

export default router;
