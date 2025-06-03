import express from "express";
import Dataset from "../models/Dataset.js";

const router = express.Router();

// GET /api/datasets/:id - Get single dataset
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid dataset ID format" });
    }

    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    return res.status(200).json(dataset);
  } catch (error) {
    console.error("Error fetching dataset:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/datasets/:id - Update dataset
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid dataset ID format" });
    }

    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // Update fields if provided
    if (name) dataset.name = name;
    if (description) dataset.description = description;

    const updatedDataset = await dataset.save();

    return res.status(200).json({
      message: "Dataset updated successfully",
      dataset: updatedDataset,
    });
  } catch (error) {
    console.error("Error updating dataset:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/datasets/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid dataset ID format" });
    }

    // שלב 1: מצא את הדאטהסט
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // שלב 2: מחק את הדאטהסט מה-DB
    await Dataset.findByIdAndDelete(id);

    return res.status(200).json({ message: "Dataset deleted successfully" });
  } catch (error) {
    console.error("Error deleting dataset:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
