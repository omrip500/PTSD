import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USERS_URL } from "../constants";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${USERS_URL}/register`, formData);
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef2f6" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 4, fontWeight: "bold", color: "#162447" }}
        >
          Create an Account
        </Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              onChange={handleChange}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
