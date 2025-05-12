import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// תמיכה ב-__dirname ב-ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// קונפיגורציית AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// POST /api/analyze
export const analyzeDataset = async (req, res) => {
  try {
    const imageFile = req.files["image"]?.[0];
    const yoloFile = req.files["yolo"]?.[0];

    if (!imageFile || !yoloFile) {
      return res.status(400).json({ message: "Missing image or yolo file" });
    }

    const imagePath = imageFile.path;
    const yoloPath = yoloFile.path;

    const pythonScript = path.join(__dirname, "..", "analysis", "analyze.py");

    const pythonProcess = spawn("/opt/anaconda3/bin/python3", [
      pythonScript,
      imagePath,
      yoloPath,
    ]);

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python error:", errorOutput);
        return res
          .status(500)
          .json({ message: "Python script failed", error: errorOutput });
      }

      try {
        const json = JSON.parse(result);
        const annotatedPath = json.annotatedImagePath;
        const summary = json.summary;

        // קריאת קובץ התמונה המסומנת
        const imageBuffer = fs.readFileSync(annotatedPath);

        // העלאה ל-S3
        const s3Key = `results/annotated-${uuidv4()}.png`;

        const s3Upload = await s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: imageBuffer,
            ContentType: "image/png",
          })
          .promise();

        // מחיקת הקובץ המקומי מהשרת
        fs.unlinkSync(annotatedPath);

        // החזרת הקישור ל-Frontend
        res.json({
          annotatedImageUrl: s3Upload.Location,
          summary,
        });
      } catch (parseErr) {
        console.error(
          "Failed to parse Python output or upload to S3:",
          parseErr
        );
        res
          .status(500)
          .json({ message: "Processing failed", error: parseErr.message });
      }
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
