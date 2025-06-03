import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Dataset from "../models/Dataset.js";
import bcrypt from "bcryptjs";

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    // Return user data for automatic login
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Incorrect password");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  console.log("Update user profile called");
  console.log("User ID from params:", req.params.id);
  try {
    const { firstName, lastName } = req.body; // Removed email from destructuring
    console.log("Request body:", { firstName, lastName });

    const user = await User.findById(req.params.id);
    console.log("user found", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    // Email is no longer updatable

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// @desc    Get user datasets
// @route   GET /api/users/:id/datasets
// @access  Private
export const getUserDatasets = async (req, res) => {
  try {
    const userId = req.params.id;

    const datasets = await Dataset.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(datasets);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    res.status(500).json({ message: "Failed to retrieve datasets" });
  }
};

export { registerUser, loginUser };
