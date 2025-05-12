// backend/routes/uploadRoutes.js
import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import fsSync from "fs";
import FormData from "form-data";
import axios from "axios";
import Dataset from "../models/Dataset.js";
import s3 from "../config/s3.js";
import upload from "../middleware/uploadTempMiddleware.js";

const router = express.Router();

router.post(
  "/dataset",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "yolo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, description, userId } = req.body;
      const imageFile = req.files?.image?.[0];
      const yoloFile = req.files?.yolo?.[0];

      if (!name || !userId || !imageFile || !yoloFile) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existing = await Dataset.findOne({ name, user: userId });
      if (existing) {
        return res.status(409).json({ message: "Dataset name already exists" });
      }

      // ⬅️ שורה שהייתה חסרה:
      const formData = new FormData();
      formData.append("image", fsSync.createReadStream(imageFile.path));
      formData.append("yolo", fsSync.createReadStream(yoloFile.path));

      const flaskUrl = process.env.FLASK_URL || "http://localhost:6000/analyze";

      const flaskRes = await axios.post(flaskUrl, formData, {
        headers: formData.getHeaders(),
      });

      const { annotated_image_base64, converted_original_base64, summary } =
        flaskRes.data;

      // 🟢 הפיכת base64 ל־Buffer
      const annotatedBuffer = Buffer.from(annotated_image_base64, "base64");
      const originalBuffer = Buffer.from(converted_original_base64, "base64");
      const yoloBuffer = await fs.readFile(yoloFile.path);

      // 🟢 העלאה ל-S3
      const annotatedKey = `results/annotated-${uuidv4()}.png`;
      const originalKey = `results/original-${uuidv4()}.png`;
      const yoloKey = `uploads/yolo/${uuidv4()}${path.extname(
        yoloFile.originalname
      )}`;

      const [annotatedUpload, originalUpload, yoloUpload] = await Promise.all([
        s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: annotatedKey,
            Body: annotatedBuffer,
            ContentType: "image/png",
          })
          .promise(),
        s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: originalKey,
            Body: originalBuffer,
            ContentType: "image/png",
          })
          .promise(),
        s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: yoloKey,
            Body: yoloBuffer,
            ContentType: yoloFile.mimetype,
          })
          .promise(),
      ]);

      // 🧠 שמירה למונגו
      const dataset = await Dataset.create({
        name,
        description,
        images: [annotatedUpload.Location],
        user: userId,
        modelOutput: {
          original: originalUpload.Location,
          yoloFile: yoloUpload.Location,
          annotated: annotatedUpload.Location,
          summary,
        },
      });

      // 🧹 ניקוי זמניים
      await Promise.all([fs.unlink(imageFile.path), fs.unlink(yoloFile.path)]);

      return res.status(201).json({
        message: "Dataset uploaded and analyzed",
        dataset,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;
