import express from "express";
import {
  exportDatasetToExcel,
  exportAllDatasetsToExcel,
  exportDatasetToZip,
} from "../controllers/exportController.js";

const router = express.Router();

// Export single dataset to Excel
router.get("/dataset/:datasetId/excel", exportDatasetToExcel);

// Export single dataset to ZIP
router.get("/dataset/:datasetId/zip", exportDatasetToZip);

// Export all datasets for a user to Excel
router.get("/user/:userId/excel", exportAllDatasetsToExcel);

export default router;
