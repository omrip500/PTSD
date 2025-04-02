// src/Pages/HomePage.jsx
import React from "react";
import { Container, Typography, Button, Box, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  // if user is logged in, redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      console.log("User is logged in:", user);
      navigate("/dashboard");
    }
  });

  return (
    <Fade in timeout={500}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8" }}>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Welcome to the PTSD Research Platform
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            Analyze mitochondrial activity and microglial morphology to advance
            PTSD inflammation research.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default HomePage;
