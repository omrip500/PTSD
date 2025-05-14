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

export default router;
