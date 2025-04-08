import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          color: "#1e293b",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1300px",
            mx: "auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo + Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src="/favicon.ico" sx={{ width: 36, height: 36 }} />
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

          {/* Desktop View - Logged In */}
          {!isMobile && userInfo && (
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
          )}

          {/* Desktop View - Not Logged In */}
          {!isMobile && !userInfo && (
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

          {/* Mobile View - Hamburger Icon */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{
                ml: "auto",
                mr: { xs: 1, sm: 2 },
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Navigation
          </Typography>
          <List>
            {userInfo ? (
              <>
                {navItems.map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Register" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
