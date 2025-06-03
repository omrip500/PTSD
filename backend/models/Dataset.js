// backend/models/Dataset.js
import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    images: [String], // פלטים מסומנים
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modelOutput: {
      // For single file uploads (backward compatibility)
      original: String, // 📌 קובץ התמונה המקורי (S3)
      yoloFile: String, // 📌 קובץ YOLO המקורי (S3)
      annotated: String, // 📌 תוצאה מסומנת (S3)
      summary: Object, // תוצאות החיזוי

      // For multiple file uploads
      results: [
        {
          original: String,
          yoloFile: String,
          annotated: String,
          summary: Object,
          imageName: String,
          yoloName: String,
        },
      ],
      totalSummary: Object, // סיכום כולל של כל התוצאות
    },
  },
  { timestamps: true }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
