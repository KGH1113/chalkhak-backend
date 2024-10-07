import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  editPost,
  uploadPost,
  getPost,
  uploadFile,
} from "../controllers/postController";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const router = Router();

// Upload route
router.post("/upload", authenticateJWT, uploadPost);

// Edit route
router.put("/edit", authenticateJWT, editPost);

// Get route
router.get("/get", authenticateJWT, getPost);

// Upload media
router.post("/upload-media", authenticateJWT, uploadMiddleware, uploadFile);
export default router;
