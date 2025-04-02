// backend/models/Dataset.js
import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    groupType: {
      type: String,
      enum: ["control", "experiment"],
      required: true,
    },
    images: [String], // URLs from S3
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ חובה
    },
  },
  { timestamps: true }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
