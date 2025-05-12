import express from "express";
import upload from "../middleware/uploadTempMiddleware.js";
import { analyzeDataset } from "../controllers/analyzeController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "yolo", maxCount: 1 },
  ]),
  analyzeDataset
);

export default router;
