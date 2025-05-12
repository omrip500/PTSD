import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { spawn } from "child_process";
import fs from "fs/promises";
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

      // קריאת קבצים שהועלו זמנית
      const [imageBuffer, yoloBuffer] = await Promise.all([
        fs.readFile(imageFile.path),
        fs.readFile(yoloFile.path),
      ]);

      const yoloKey = `uploads/yolo/${uuidv4()}${path.extname(
        yoloFile.originalname
      )}`;
      const yoloUpload = await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: yoloKey,
          Body: yoloBuffer,
          ContentType: yoloFile.mimetype,
        })
        .promise();

      // הרצת פייתון
      const pythonScript = path.resolve("analysis/analyze.py");
      const python = spawn("/opt/anaconda3/bin/python3", [
        pythonScript,
        imageFile.path,
        yoloFile.path,
      ]);

      let result = "",
        error = "";

      python.stdout.on("data", (data) => (result += data.toString()));
      python.stderr.on("data", (data) => (error += data.toString()));

      python.on("close", async (code) => {
        try {
          if (code !== 0) {
            console.error("Python error:", error);
            return res
              .status(500)
              .json({ message: "Python script failed", error });
          }

          const { annotatedImagePath, convertedOriginalPath, summary } =
            JSON.parse(result);

          // העלאת התמונה המסומנת
          const annotatedBuffer = await fs.readFile(annotatedImagePath);
          const annotatedKey = `results/annotated-${uuidv4()}.png`;
          const annotatedUpload = await s3
            .upload({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: annotatedKey,
              Body: annotatedBuffer,
              ContentType: "image/png",
            })
            .promise();

          // העלאת התמונה המומרת מ־TIF ל־PNG
          const convertedBuffer = await fs.readFile(convertedOriginalPath);
          const convertedKey = `results/original-${uuidv4()}.png`;
          const convertedUpload = await s3
            .upload({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: convertedKey,
              Body: convertedBuffer,
              ContentType: "image/png",
            })
            .promise();

          // שמירה למסד הנתונים
          const dataset = await Dataset.create({
            name,
            description,
            images: [annotatedUpload.Location],
            user: userId,
            modelOutput: {
              original: convertedUpload.Location,
              yoloFile: yoloUpload.Location,
              annotated: annotatedUpload.Location,
              summary,
            },
          });

          // ניקוי קבצים זמניים
          await Promise.all([
            fs.unlink(imageFile.path),
            fs.unlink(yoloFile.path),
            fs.unlink(annotatedImagePath),
            fs.unlink(convertedOriginalPath),
          ]);

          return res.status(201).json({
            message: "Dataset uploaded and analyzed",
            dataset,
          });
        } catch (err) {
          console.error("Post-process error:", err);
          return res
            .status(500)
            .json({ message: "Failed after Python", error: err.message });
        }
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;
