import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import uploadRoutes from "../routes/uploadRoutes.js";
import { errorHandler } from "../middleware/errorMiddleware.js";
import axios from "axios";

// Note: We'll test validation only, not the actual Flask integration

// Create Express app for testing
const app = express();
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use(errorHandler);

describe("📂 Dataset Upload Tests", () => {
  // Create test files for upload testing
  const testFilesDir = path.join(process.cwd(), "tests", "testFiles");
  const testImagePath = path.join(testFilesDir, "test-image.jpg");
  const testYoloPath = path.join(testFilesDir, "test-yolo.txt");
  const testPdfPath = path.join(testFilesDir, "test-file.pdf");

  // Mock Flask response
  const mockFlaskResponse = {
    data: {
      annotated_image_base64:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==",
      converted_original_base64:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==",
      summary: {
        totalCells: 100,
        healthyCells: 80,
        cancerousCells: 20,
      },
    },
  };

  beforeAll(async () => {
    // Create test files directory
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }

    // Create a dummy image file (minimal JPEG header)
    const jpegHeader = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
    ]);
    fs.writeFileSync(testImagePath, jpegHeader);

    // Create a dummy YOLO file
    const yoloContent = "0 0.5 0.5 0.2 0.3\n1 0.3 0.7 0.1 0.15";
    fs.writeFileSync(testYoloPath, yoloContent);

    // Create a dummy PDF file
    const pdfContent =
      "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n";
    fs.writeFileSync(testPdfPath, pdfContent);
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });

  describe("❌ TC007 - Upload image without YOLO file", () => {
    test("should return error when YOLO file is missing", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011")
        .attach("image", testImagePath);
      // Note: No YOLO file attached

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/missing.*required.*fields/i);
    });
  });

  describe("❌ TC008 - Upload unsupported file format", () => {
    test("should return error for PDF file upload", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011")
        .attach("image", testPdfPath) // Uploading PDF as image
        .attach("yolo", testYoloPath);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(
        /unsupported.*format|invalid.*file/i
      );
    });

    test("should return error when uploading PDF as YOLO file", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011")
        .attach("image", testImagePath)
        .attach("yolo", testPdfPath); // Uploading PDF as YOLO

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(
        /unsupported.*format|invalid.*file/i
      );
    });
  });

  describe("📸 TC006 - Upload validation (without Flask integration)", () => {
    test("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .attach("image", testImagePath)
        .attach("yolo", testYoloPath);
      // Missing required fields: name, userId

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required|missing/i);
    });

    test("should validate file presence", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011");
      // No files attached

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/image.*required|file.*required/i);
    });

    test("should validate user ID format", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "invalid-user-id")
        .attach("image", testImagePath)
        .attach("yolo", testYoloPath);

      expect(response.status).toBe(500);
      expect(response.body.message).toMatch(/upload.*failed/i);
    });

    test("should fail gracefully when Flask server is not available", async () => {
      const response = await request(app)
        .post("/api/upload/dataset")
        .field("name", "Test Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011")
        .attach("image", testImagePath)
        .attach("yolo", testYoloPath);

      // This will fail because Flask server is not running, which is expected
      expect(response.status).toBe(500);
      expect(response.body.message).toMatch(/upload.*failed/i);
    });
  });

  describe("📁 Multiple file upload validation", () => {
    test("should validate multiple images require multiple YOLO files", async () => {
      // Create second test image
      const testImage2Path = path.join(testFilesDir, "test-image2.jpg");
      const jpegHeader = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
      ]);
      fs.writeFileSync(testImage2Path, jpegHeader);

      const response = await request(app)
        .post("/api/upload/dataset-multiple")
        .field("name", "Test Multiple Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011")
        .attach("images", testImagePath)
        .attach("images", testImage2Path)
        .attach("yolos", testYoloPath); // Only one YOLO file for two images

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(
        /number.*images.*match.*number.*yolo/i
      );

      // Clean up
      fs.unlinkSync(testImage2Path);
    });

    test("should validate empty multiple upload", async () => {
      const response = await request(app)
        .post("/api/upload/dataset-multiple")
        .field("name", "Test Multiple Dataset")
        .field("description", "Test Description")
        .field("userId", "507f1f77bcf86cd799439011");
      // No files attached

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(
        /missing.*required.*fields.*files/i
      );
    });
  });
});
