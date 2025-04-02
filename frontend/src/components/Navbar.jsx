import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navItems = user
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Upload Dataset", path: "/uploadDataset" },
        { label: "View Results", path: "/history" },
        { label: "My Profile", path: "/profile" },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0D47A1, #1976d2)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            PTSD Research Tool
          </Typography>

          {user ? (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? "#ffe082" : "#fff",
                      fontWeight: isActive(item.path) ? "bold" : "normal",
                      borderBottom: isActive(item.path)
                        ? "2px solid #ffe082"
                        : "none",
                      borderRadius: 0,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>

              {/* Icon menu for mobile */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  bgcolor: isActive(item.path) ? "#e3f2fd" : "inherit",
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
