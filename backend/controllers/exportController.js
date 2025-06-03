import XLSX from "xlsx";
import Dataset from "../models/Dataset.js";
import archiver from "archiver";
import axios from "axios";

export const exportDatasetToExcel = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Check if it's a single file or multiple files dataset
    if (dataset.modelOutput.results && dataset.modelOutput.results.length > 0) {
      // Multiple files dataset
      const summaryData = [];
      const detailsData = [];

      // Add total summary
      summaryData.push(["Dataset Summary"]);
      summaryData.push(["Dataset Name", dataset.name]);
      summaryData.push(["Description", dataset.description || "N/A"]);
      summaryData.push(["Total Files", dataset.modelOutput.results.length]);
      summaryData.push([
        "Created At",
        dataset.createdAt.toISOString().split("T")[0],
      ]);
      summaryData.push([]); // Empty row

      // Add total counts
      summaryData.push(["Total Prediction Summary"]);
      if (dataset.modelOutput.totalSummary) {
        Object.entries(dataset.modelOutput.totalSummary).forEach(
          ([key, value]) => {
            summaryData.push([key, value]);
          }
        );
      }

      // Add details for each file
      detailsData.push([
        "File Name",
        "Image Name",
        "YOLO Name",
        "Resting",
        "Surveilling",
        "Activated",
        "Resolution",
      ]);

      dataset.modelOutput.results.forEach((result, index) => {
        detailsData.push([
          `File ${index + 1}`,
          result.imageName || "N/A",
          result.yoloName || "N/A",
          result.summary?.Resting || 0,
          result.summary?.Surveilling || 0,
          result.summary?.Activated || 0,
          result.summary?.Resolution || 0,
        ]);
      });

      // Create worksheets
      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
      const detailsWorksheet = XLSX.utils.aoa_to_sheet(detailsData);

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");
      XLSX.utils.book_append_sheet(workbook, detailsWorksheet, "Details");
    } else {
      // Single file dataset (backward compatibility)
      const data = [];

      data.push(["Dataset Summary"]);
      data.push(["Dataset Name", dataset.name]);
      data.push(["Description", dataset.description || "N/A"]);
      data.push(["Created At", dataset.createdAt.toISOString().split("T")[0]]);
      data.push([]); // Empty row

      data.push(["Prediction Summary"]);
      if (dataset.modelOutput.summary) {
        Object.entries(dataset.modelOutput.summary).forEach(([key, value]) => {
          data.push([key, value]);
        });
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    }

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Set response headers
    const fileName = `${dataset.name.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_results.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", excelBuffer.length);

    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error("Excel export error:", error);
    res
      .status(500)
      .json({ message: "Failed to export Excel file", error: error.message });
  }
};

export const exportAllDatasetsToExcel = async (req, res) => {
  try {
    const { userId } = req.params;

    const datasets = await Dataset.find({ user: userId });
    if (!datasets || datasets.length === 0) {
      return res.status(404).json({ message: "No datasets found" });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Summary sheet with all datasets
    const summaryData = [];
    summaryData.push(["All Datasets Summary"]);
    summaryData.push(["Total Datasets", datasets.length]);
    summaryData.push(["Export Date", new Date().toISOString().split("T")[0]]);
    summaryData.push([]); // Empty row

    summaryData.push([
      "Dataset Name",
      "Description",
      "Files Count",
      "Total Resting",
      "Total Surveilling",
      "Total Activated",
      "Total Resolution",
      "Created Date",
    ]);

    datasets.forEach((dataset) => {
      let filesCount = 1;
      let totalSummary = dataset.modelOutput.summary || {};

      if (
        dataset.modelOutput.results &&
        dataset.modelOutput.results.length > 0
      ) {
        filesCount = dataset.modelOutput.results.length;
        totalSummary = dataset.modelOutput.totalSummary || {};
      }

      summaryData.push([
        dataset.name,
        dataset.description || "N/A",
        filesCount,
        totalSummary.Resting || 0,
        totalSummary.Surveilling || 0,
        totalSummary.Activated || 0,
        totalSummary.Resolution || 0,
        dataset.createdAt.toISOString().split("T")[0],
      ]);
    });

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "All Datasets");

    // Individual sheets for each dataset
    datasets.forEach((dataset, index) => {
      const sheetData = [];

      sheetData.push([dataset.name]);
      sheetData.push(["Description", dataset.description || "N/A"]);
      sheetData.push([
        "Created At",
        dataset.createdAt.toISOString().split("T")[0],
      ]);
      sheetData.push([]); // Empty row

      if (
        dataset.modelOutput.results &&
        dataset.modelOutput.results.length > 0
      ) {
        // Multiple files
        sheetData.push(["File Details"]);
        sheetData.push([
          "File Name",
          "Image Name",
          "YOLO Name",
          "Resting",
          "Surveilling",
          "Activated",
          "Resolution",
        ]);

        dataset.modelOutput.results.forEach((result, fileIndex) => {
          sheetData.push([
            `File ${fileIndex + 1}`,
            result.imageName || "N/A",
            result.yoloName || "N/A",
            result.summary?.Resting || 0,
            result.summary?.Surveilling || 0,
            result.summary?.Activated || 0,
            result.summary?.Resolution || 0,
          ]);
        });
      } else {
        // Single file
        sheetData.push(["Prediction Summary"]);
        if (dataset.modelOutput.summary) {
          Object.entries(dataset.modelOutput.summary).forEach(
            ([key, value]) => {
              sheetData.push([key, value]);
            }
          );
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const sheetName = `Dataset_${index + 1}`.substring(0, 31); // Excel sheet name limit
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Set response headers
    const fileName = `all_datasets_results.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", excelBuffer.length);

    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error("Excel export error:", error);
    res
      .status(500)
      .json({ message: "Failed to export Excel file", error: error.message });
  }
};

export const exportDatasetToZip = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // Helper function to download image from URL
    const downloadImage = async (url) => {
      try {
        console.log("Downloading image from:", url);
        const response = await axios.get(url, {
          responseType: "stream",
          timeout: 30000, // 30 seconds timeout
        });
        return response.data;
      } catch (error) {
        console.error("Failed to download image:", url, error.message);
        throw error;
      }
    };

    // Helper function to get file extension from URL
    const getFileExtension = (url) => {
      try {
        const pathname = new URL(url).pathname;
        const ext = pathname.split(".").pop() || "jpg";
        return ext.toLowerCase();
      } catch (error) {
        console.warn("Failed to parse URL:", url);
        return "jpg";
      }
    };

    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 6 }, // Compression level
    });

    // Set response headers
    const fileName = `${dataset.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}_images.zip`;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe archive to response
    archive.pipe(res);

    let filesAdded = 0;

    if (
      dataset.modelOutput?.results &&
      dataset.modelOutput.results.length > 0
    ) {
      // Multiple files dataset
      console.log(
        "Processing multiple files dataset with",
        dataset.modelOutput.results.length,
        "files"
      );

      for (let i = 0; i < dataset.modelOutput.results.length; i++) {
        const result = dataset.modelOutput.results[i];
        const sanitizedImageName =
          result.imageName?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
          `image_${i + 1}`;
        const folderName = `File_${i + 1}_${sanitizedImageName}`;

        console.log(`Processing file ${i + 1}:`, folderName);

        // Add original image
        if (result.original) {
          try {
            const originalStream = await downloadImage(result.original);
            const originalExt = getFileExtension(result.original);
            const fileName = `${folderName}/original.${originalExt}`;
            archive.append(originalStream, { name: fileName });
            filesAdded++;
            console.log("Added original image:", fileName);
          } catch (error) {
            console.warn(
              `Failed to add original image for file ${i + 1}:`,
              error.message
            );
          }
        }

        // Add annotated image
        if (result.annotated) {
          try {
            const annotatedStream = await downloadImage(result.annotated);
            const annotatedExt = getFileExtension(result.annotated);
            const fileName = `${folderName}/predicted.${annotatedExt}`;
            archive.append(annotatedStream, { name: fileName });
            filesAdded++;
            console.log("Added annotated image:", fileName);
          } catch (error) {
            console.warn(
              `Failed to add annotated image for file ${i + 1}:`,
              error.message
            );
          }
        }
      }
    } else {
      // Single file dataset
      console.log("Processing single file dataset");
      const folderName = dataset.name.replace(/[^a-zA-Z0-9._-]/g, "_");

      // Add original image
      if (dataset.modelOutput?.original) {
        try {
          const originalStream = await downloadImage(
            dataset.modelOutput.original
          );
          const originalExt = getFileExtension(dataset.modelOutput.original);
          const fileName = `${folderName}/original.${originalExt}`;
          archive.append(originalStream, { name: fileName });
          filesAdded++;
          console.log("Added original image:", fileName);
        } catch (error) {
          console.warn("Failed to add original image:", error.message);
        }
      }

      // Add annotated image
      if (dataset.modelOutput?.annotated) {
        try {
          const annotatedStream = await downloadImage(
            dataset.modelOutput.annotated
          );
          const annotatedExt = getFileExtension(dataset.modelOutput.annotated);
          const fileName = `${folderName}/predicted.${annotatedExt}`;
          archive.append(annotatedStream, { name: fileName });
          filesAdded++;
          console.log("Added annotated image:", fileName);
        } catch (error) {
          console.warn("Failed to add annotated image:", error.message);
        }
      }
    }

    console.log(`Total files added to ZIP: ${filesAdded}`);

    if (filesAdded === 0) {
      return res
        .status(400)
        .json({ message: "No images could be added to the ZIP file" });
    }

    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    console.error("ZIP export error:", error);
    res
      .status(500)
      .json({ message: "Failed to export ZIP file", error: error.message });
  }
};
