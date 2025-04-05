import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Chart from "../components/DummyChart"; // ניצור אותו בהמשך
import { USERS_URL } from "../constants";

const ViewPastResultsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch(`${USERS_URL}/${user._id}/datasets`);
        const data = await response.json();
        console.log("Fetched datasets:", data);

        setDatasets(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDatasets();
    }
  }, [user._id]);

  // the route api/datasets is not existing yet in the backend.
  const handleDelete = async (datasetId) => {
    try {
      await fetch(`http://localhost:8000/api/datasets/${datasetId}`, {
        method: "DELETE",
      });
      setDatasets((prev) => prev.filter((ds) => ds._id !== datasetId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          My Uploaded Datasets
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : datasets.length === 0 ? (
          <Typography>No datasets found.</Typography>
        ) : (
          datasets.map((dataset) => (
            <Paper key={dataset._id} elevation={4} sx={{ p: 4, mb: 4 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6">{dataset.name}</Typography>
                  <Typography color="text.secondary">
                    {dataset.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Group: <b>{dataset.groupType}</b>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} textAlign="right">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(dataset._id)}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Images:
              </Typography>
              <Grid container spacing={1}>
                {dataset.images.map((url, idx) => (
                  <Grid item key={idx}>
                    <img
                      src={url}
                      alt={`dataset-img-${idx}`}
                      width={100}
                      height={100}
                      style={{ borderRadius: 8 }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Dummy Model Output:
              </Typography>
              <Typography color="text.secondary">
                • PTSD probability: 76% <br />• Signs of trauma observed in 3
                images.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Chart /> {/* גרף דמה */}
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </Box>
  );
};

export default ViewPastResultsPage;
