import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import User from '../models/userModel.js';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

describe('👤 Profile Management Tests', () => {
  
  let testUser;
  let userId;

  beforeEach(async () => {
    // Create a test user before each test
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'testpassword'
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    testUser = response.body;
    userId = testUser._id;
  });

  describe('📝 TC012 - Update first name and last name', () => {
    test('should update profile successfully', async () => {
      const updateData = {
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'UpdatedFirst');
      expect(response.body).toHaveProperty('lastName', 'UpdatedLast');
      expect(response.body).toHaveProperty('email', 'testuser@example.com'); // Email should remain unchanged
      expect(response.body).toHaveProperty('_id', userId);

      // Verify changes were saved to database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.firstName).toBe('UpdatedFirst');
      expect(updatedUser.lastName).toBe('UpdatedLast');
      expect(updatedUser.email).toBe('testuser@example.com'); // Email should not change
    });

    test('should update only first name when last name not provided', async () => {
      const updateData = {
        firstName: 'OnlyFirstUpdated'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'OnlyFirstUpdated');
      expect(response.body).toHaveProperty('lastName', 'User'); // Should remain original
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('should update only last name when first name not provided', async () => {
      const updateData = {
        lastName: 'OnlyLastUpdated'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'Test'); // Should remain original
      expect(response.body).toHaveProperty('lastName', 'OnlyLastUpdated');
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('should not update email even if provided', async () => {
      const updateData = {
        firstName: 'NewFirst',
        lastName: 'NewLast',
        email: 'newemail@example.com' // This should be ignored
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'NewFirst');
      expect(response.body).toHaveProperty('lastName', 'NewLast');
      expect(response.body).toHaveProperty('email', 'testuser@example.com'); // Should remain original

      // Verify email wasn't changed in database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.email).toBe('testuser@example.com');
    });
  });

  describe('❌ TC013 - Update profile with empty fields', () => {
    test('should handle empty first name', async () => {
      const updateData = {
        firstName: '',
        lastName: 'ValidLast'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'Test'); // Should remain original
      expect(response.body).toHaveProperty('lastName', 'ValidLast');
    });

    test('should handle empty last name', async () => {
      const updateData = {
        firstName: 'ValidFirst',
        lastName: ''
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'ValidFirst');
      expect(response.body).toHaveProperty('lastName', 'User'); // Should remain original
    });

    test('should handle completely empty request body', async () => {
      const updateData = {};

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'Test'); // Should remain original
      expect(response.body).toHaveProperty('lastName', 'User'); // Should remain original
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });
  });

  describe('❌ TC013b - Update profile with invalid user ID', () => {
    test('should return 404 for non-existent user', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but non-existent
      const updateData = {
        firstName: 'Test',
        lastName: 'Test'
      };

      const response = await request(app)
        .put(`/api/users/${fakeUserId}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    test('should handle invalid user ID format', async () => {
      const invalidUserId = 'invalid-id';
      const updateData = {
        firstName: 'Test',
        lastName: 'Test'
      };

      const response = await request(app)
        .put(`/api/users/${invalidUserId}`)
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Update failed');
    });
  });
});
