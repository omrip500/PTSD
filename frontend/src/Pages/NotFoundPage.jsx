import React from "react";
import { Container, Typography, Button, Box, Slide } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Slide direction="down" in={true}>
          <Box>
            <Typography variant="h2" color="error" gutterBottom>
              404
            </Typography>
            <Typography variant="h5" gutterBottom>
              Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button variant="contained" component={Link} to="/" sx={{ mt: 3 }}>
              Go to Home
            </Button>
          </Box>
        </Slide>
      </Container>
    </>
  );
};

export default NotFoundPage;
