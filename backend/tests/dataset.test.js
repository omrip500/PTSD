import request from "supertest";
import express from "express";
import datasetRoutes from "../routes/datasetRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import { errorHandler } from "../middleware/errorMiddleware.js";
import Dataset from "../models/Dataset.js";
import User from "../models/userModel.js";

// Create Express app for testing
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/datasets", datasetRoutes);
app.use(errorHandler);

describe("📊 Dataset Management Tests", () => {
  let testUser;
  let userId;
  let testDataset;

  beforeEach(async () => {
    // Create a test user
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "testpassword",
    };

    const userResponse = await request(app)
      .post("/api/users/register")
      .send(userData);

    testUser = userResponse.body;
    userId = testUser._id;

    // Create a test dataset
    testDataset = await Dataset.create({
      name: "Test Dataset",
      description: "Test Description",
      user: userId,
      modelOutput: {
        original: "test-original.jpg",
        yoloFile: "test-yolo.txt",
        annotated: "test-annotated.jpg",
        summary: {
          totalCells: 100,
          healthyCells: 80,
          cancerousCells: 20,
        },
      },
    });
  });

  describe("📁 TC011 - View existing results", () => {
    test("should retrieve user datasets successfully", async () => {
      const response = await request(app).get(`/api/users/datasets/${userId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("name", "Test Dataset");
      expect(response.body[0]).toHaveProperty(
        "description",
        "Test Description"
      );
      expect(response.body[0]).toHaveProperty("user", userId);
      expect(response.body[0]).toHaveProperty("modelOutput");
      expect(response.body[0].modelOutput).toHaveProperty("summary");
    });

    test("should return empty array for user with no datasets", async () => {
      // Create another user
      const newUserData = {
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "password123",
      };

      const newUserResponse = await request(app)
        .post("/api/users/register")
        .send(newUserData);

      const newUserId = newUserResponse.body._id;

      const response = await request(app).get(
        `/api/users/datasets/${newUserId}`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test("should handle invalid user ID", async () => {
      const invalidUserId = "invalid-id";

      const response = await request(app).get(
        `/api/users/datasets/${invalidUserId}`
      );

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Failed to retrieve datasets"
      );
    });
  });

  describe("🗑️ TC014 - Delete dataset", () => {
    test("should delete dataset successfully", async () => {
      const response = await request(app).delete(
        `/api/datasets/${testDataset._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/deleted.*successfully/i);

      // Verify dataset was deleted from database
      const deletedDataset = await Dataset.findById(testDataset._id);
      expect(deletedDataset).toBeNull();
    });

    test("should return 404 for non-existent dataset", async () => {
      const fakeDatasetId = "507f1f77bcf86cd799439011";

      const response = await request(app).delete(
        `/api/datasets/${fakeDatasetId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/dataset.*not.*found/i);
    });

    test("should handle invalid dataset ID format", async () => {
      const invalidDatasetId = "invalid-id";

      const response = await request(app).delete(
        `/api/datasets/${invalidDatasetId}`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/invalid.*dataset.*id.*format/i);
    });
  });

  describe("📝 Dataset update operations", () => {
    test("should update dataset name and description", async () => {
      const updateData = {
        name: "Updated Dataset Name",
        description: "Updated Description",
      };

      const response = await request(app)
        .put(`/api/datasets/${testDataset._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.dataset).toHaveProperty(
        "name",
        "Updated Dataset Name"
      );
      expect(response.body.dataset).toHaveProperty(
        "description",
        "Updated Description"
      );

      // Verify changes in database
      const updatedDataset = await Dataset.findById(testDataset._id);
      expect(updatedDataset.name).toBe("Updated Dataset Name");
      expect(updatedDataset.description).toBe("Updated Description");
    });

    test("should handle partial updates", async () => {
      const updateData = {
        name: "Only Name Updated",
      };

      const response = await request(app)
        .put(`/api/datasets/${testDataset._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.dataset).toHaveProperty("name", "Only Name Updated");
      expect(response.body.dataset).toHaveProperty(
        "description",
        "Test Description"
      ); // Should remain unchanged
    });
  });

  describe("📊 Dataset statistics and summary", () => {
    test("should retrieve dataset with complete model output", async () => {
      const response = await request(app).get(
        `/api/datasets/${testDataset._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("modelOutput");
      expect(response.body.modelOutput).toHaveProperty("summary");
      expect(response.body.modelOutput.summary).toHaveProperty(
        "totalCells",
        100
      );
      expect(response.body.modelOutput.summary).toHaveProperty(
        "healthyCells",
        80
      );
      expect(response.body.modelOutput.summary).toHaveProperty(
        "cancerousCells",
        20
      );
    });

    test("should handle dataset without model output", async () => {
      // Create dataset without model output
      const incompleteDataset = await Dataset.create({
        name: "Incomplete Dataset",
        description: "No model output",
        user: userId,
      });

      const response = await request(app).get(
        `/api/datasets/${incompleteDataset._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Incomplete Dataset");
      expect(response.body.modelOutput).toEqual({ results: [] }); // Default empty modelOutput
    });
  });
});
