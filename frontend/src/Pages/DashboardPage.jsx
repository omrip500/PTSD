// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Divider,
  Button,
  Fade,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <Fade in timeout={500}>
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user.firstName}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    sx={{ bgcolor: deepPurple[500], width: 80, height: 80 }}
                  >
                    {user.firstName[0]}
                  </Avatar>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                  <Divider sx={{ my: 2, width: "100%" }} />
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate("/profile")}
                  >
                    View Profile
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={() => navigate("/UploadDataset")}
                    >
                      Upload New Dataset
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="secondary"
                      onClick={() => navigate("/history")}
                    >
                      View Past Results
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => alert("Export feature coming soon!")}
                    >
                      Export Analysis Results
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default DashboardPage;
