// DashboardPage.jsx (Complete Redesign)
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { User, UploadCloud, History, FileDown } from "lucide-react";

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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eef2f6" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#162447",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: "#1f4068", mb: 2 }}>
          <User size={50} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {user.email}
        </Typography>

        <Divider sx={{ bgcolor: "#394867", width: "80%", my: 3 }} />

        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#fff" }}
          onClick={() => navigate("/profile")}
        >
          View Profile
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            Dashboard
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                p: 3,
                textAlign: "center",
              }}
            >
              <IconButton
                sx={{ bgcolor: "#1e81b0", color: "#fff", mb: 2 }}
                size="large"
              >
                <UploadCloud size={32} />
              </IconButton>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload New Dataset
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/UploadDataset")}
              >
                Start Uploading
              </Button>
            </Box>

            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                p: 3,
                textAlign: "center",
              }}
            >
              <IconButton
                sx={{ bgcolor: "#e94560", color: "#fff", mb: 2 }}
                size="large"
              >
                <History size={32} />
              </IconButton>
              <Typography variant="h6" sx={{ mb: 2 }}>
                View Past Results
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/history")}
              >
                View Results
              </Button>
            </Box>

            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                p: 3,
                textAlign: "center",
                gridColumn: { xs: "span 1", md: "span 2" },
              }}
            >
              <IconButton
                sx={{ bgcolor: "#0f3460", color: "#fff", mb: 2 }}
                size="large"
              >
                <FileDown size={32} />
              </IconButton>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Export Analysis Results
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => alert("Export feature coming soon!")}
              >
                Export Now
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;
