import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/uploads"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uuid = `media:${randomUUID()}`;
    cb(null, `${Date.now()}-${uuid}${path.extname(file.originalname)}`);
  },
});

// File type validation
function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images and video files are allowed"));
  }
}

// Maximum file size (100MB)
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
});

export const uploadMiddleware = upload.single("file");
