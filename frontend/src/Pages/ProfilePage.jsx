// MyProfilePage.jsx (New Template)
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USERS_URL } from "../constants";
import { toast } from "react-toastify";

const MyProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) setFormData(user);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.put(`${USERS_URL}/${user._id}`, formData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef2f6" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
            {formData.firstName[0]}
          </Avatar>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#162447" }}
          >
            My Profile
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: "#fff",
              p: 4,
              borderRadius: 3,
              width: "100%",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
            }}
          >
            <Stack spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                required
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                required
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                required
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default MyProfilePage;

// Similar comprehensive redesigns should be applied to UploadDatasetPage, ViewPastResultsPage, NotFoundPage, and Navbar to ensure consistent UI and responsive layouts across all pages.
