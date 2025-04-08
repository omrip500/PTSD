import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload", path: "/uploadDataset" },
    { label: "Results", path: "/history" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        color: "#1e293b",
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1300px",
          mx: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src="/favicon.ico"
            sx={{ width: 36, height: 36 }}
            alt="logo"
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#1e293b",
              fontSize: "1.2rem",
            }}
          >
            PTSD Research Tool
          </Typography>
        </Box>

        {/* Navigation - if user logged in */}
        {userInfo ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: isActive(item.path) ? "#2563eb" : "#64748b",
                  borderBottom: isActive(item.path)
                    ? "2px solid #2563eb"
                    : "2px solid transparent",
                  borderRadius: 0,
                  fontSize: "0.95rem",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#64748b",
                border: "1px solid #cbd5e1",
                ml: 1,
                "&:hover": {
                  color: "#ef4444",
                  borderColor: "#ef4444",
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                textTransform: "none",
                color: "#2563eb",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
