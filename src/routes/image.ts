import express from "express";
import { deleteImage, searchImage, uploadImage } from "../controllers/imageController";
import { authMiddleware, authorizeRole } from "../middleware/middleware";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"));
  }
};

const upload = multer({ storage: storage });


router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.delete("/:id", authMiddleware, deleteImage);
router.get("/search/:username", authMiddleware, searchImage);




export default router;
