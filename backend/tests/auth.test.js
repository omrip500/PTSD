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

describe('🔐 Authentication Tests', () => {
  
  describe('✅ TC001 - Login with correct credentials', () => {
    test('should login successfully with valid email and password', async () => {
      // First, create a user
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Now try to login
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('firstName', 'John');
      expect(response.body).toHaveProperty('lastName', 'Doe');
      expect(response.body).toHaveProperty('email', 'john@example.com');
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('❌ TC002 - Login with incorrect password', () => {
    test('should return "Incorrect password" error', async () => {
      // First, create a user
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'correctpassword'
      };
      
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to login with wrong password
      const loginData = {
        email: 'jane@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Incorrect password');
    });
  });

  describe('❌ TC003 - Login with non-existent email', () => {
    test('should return "User not found" error', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'anypassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('🆕 TC004 - Register new user', () => {
    test('should register user successfully and return user data', async () => {
      const userData = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: 'securepassword'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('firstName', 'Alice');
      expect(response.body).toHaveProperty('lastName', 'Johnson');
      expect(response.body).toHaveProperty('email', 'alice@example.com');
      expect(response.body).not.toHaveProperty('password');

      // Verify user was saved to database
      const savedUser = await User.findOne({ email: 'alice@example.com' });
      expect(savedUser).toBeTruthy();
      expect(savedUser.firstName).toBe('Alice');
    });
  });

  describe('🛑 TC005 - Register with existing email', () => {
    test('should return "User already exists" error', async () => {
      const userData = {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@example.com',
        password: 'password123'
      };

      // Register user first time
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to register same email again
      const duplicateUserData = {
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'bob@example.com',
        password: 'differentpassword'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(duplicateUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });
});
