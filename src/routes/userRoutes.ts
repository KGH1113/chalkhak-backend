import { Router } from "express";
import {
  editUser,
  followUser,
  unFollowUser,
  getFollowings,
  getFollowers,
  getUser,
} from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

// Update user details route (requires JWT)
router.put("/edit", authenticateJWT, editUser);

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
