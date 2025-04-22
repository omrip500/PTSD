import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Dataset from "../models/Dataset.js";

const router = express.Router();

router.post("/dataset", upload.array("images", 20), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.location);

    const { name, description, groupType, userId } = req.body;

    if (!name || !groupType || !userId || imageUrls.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Dataset.findOne({ name, user: userId });
    if (existing) {
      return res.status(409).json({
        message: "A dataset with this name already exists for this user.",
      });
    }

    const newDataset = new Dataset({
      name,
      description,
      groupType,
      images: imageUrls,
      user: userId,
    });

    await newDataset.save();

    res.status(201).json({
      message: "Dataset uploaded and saved successfully",
      dataset: newDataset,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload dataset" });
  }
});

export default router;
