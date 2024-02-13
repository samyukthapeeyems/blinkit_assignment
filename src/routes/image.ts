import express from "express";
import { uploadImage } from "../controllers/imageController";
import { authMiddleware} from "../middleware/authMiddleware";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

export default router;
