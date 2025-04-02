// src/Pages/MyProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user || !user._id) {
        toast.error("User not found in localStorage");
        return;
      }

      const { data } = await axios.put(
        `http://localhost:8000/api/users/${user._id}`,
        formData
      );

      // עדכון localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast.success("Profile updated successfully!"); // 🟢
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile"); // 🔴
    }
  };

  const initial = formData.firstName
    ? formData.firstName[0].toUpperCase()
    : "?";

  return (
    <Fade in timeout={500}>
      <Box sx={{ bgcolor: "#f0f4f8", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#0D47A1",
                  mx: "auto",
                  fontSize: 36,
                  fontWeight: "bold",
                }}
              >
                {initial}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                My Profile
              </Typography>
              <Typography color="textSecondary">
                Manage your personal information
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={formData.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      backgroundColor: "#0D47A1",
                      "&:hover": {
                        backgroundColor: "#08306b",
                      },
                    }}
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default MyProfilePage;
