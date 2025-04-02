// src/pages/LoginPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Slide,
  Alert,
} from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("userInfo");
    if (user) {
      // Redirect to dashboard if user is logged in
      navigate("/dashboard");
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null); // clear previous error

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // for cookies (if using them)
        }
      );

      // Store user info locally if needed
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 3, backgroundColor: "#E3F2FD" }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </>
  );
};

export default LoginPage;
