// HomePage.jsx (Complete Redesign)
import React, { use } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#eef2f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          py: 8,
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: "50%" }, mb: { xs: 4, md: 0 } }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", color: "#162447", mb: 3 }}
          >
            Revolutionize PTSD Research
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
            Explore innovative methods for analyzing mitochondrial activity and
            microglial morphology. Join us in advancing PTSD inflammation
            research.
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            height: { xs: 500, md: 500 },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
          }}
        >
          <img
            src="https://cdn.synappsehealth.com/res-prod/img/blog/articles/person_with_post_traumatic_stress_disorder.png"
            alt="PTSD Research Visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
