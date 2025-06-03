import express from "express";
import Dataset from "../models/Dataset.js";

const router = express.Router();

// DELETE /api/datasets/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
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

// PUT /api/datasets/:id - Update dataset name and description
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  console.log("Update dataset request:", { id, name, description });

  try {
    // מצא את הדאטהסט
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      console.log("Dataset not found:", id);
      return res.status(404).json({ message: "Dataset not found" });
    }

    // עדכן את השם והתיאור
    if (name !== undefined) dataset.name = name;
    if (description !== undefined) dataset.description = description;

    console.log("Before save:", {
      name: dataset.name,
      description: dataset.description,
    });

    // שמור את השינויים
    await dataset.save();

    console.log("After save - sending response");

    return res.status(200).json({
      message: "Dataset updated successfully",
      dataset: dataset,
    });
  } catch (error) {
    console.error("Error updating dataset:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
