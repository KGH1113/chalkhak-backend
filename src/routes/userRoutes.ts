import { Router } from "express";
import {
  register,
  login,
  editUser,
  protectedRoute,
  followUser,
  unFollowUser,
  getFollowings,
  getFollowers,
  getUser,
} from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Update user details route (requires JWT)
router.put("/edit", authenticateJWT, editUser);

// Protected route (requires JWT)
router.get("/protected", authenticateJWT, protectedRoute);

// Following user
router.post("/follow", authenticateJWT, followUser);

// Unfollowing user
router.post("/unfollow", authenticateJWT, unFollowUser);

// Get followers
router.get("/followers", authenticateJWT, getFollowers);

// Get followings
router.get("/followings", authenticateJWT, getFollowings);

// Get user by userId
router.post("/get", authenticateJWT, getUser);

export default router;
