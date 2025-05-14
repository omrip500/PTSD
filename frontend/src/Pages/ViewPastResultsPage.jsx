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
import DownloadIcon from "@mui/icons-material/Download";
import Navbar from "../components/Navbar";
import { USERS_URL } from "../constants";
import { DATASET_URL } from "../constants";

const ViewPastResultsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch(`${USERS_URL}/datasets/${user._id}`);
        const data = await response.json();
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

  const handleDelete = async (datasetId) => {
    try {
      setDeletingId(datasetId);
      const response = await fetch(`${DATASET_URL}/${datasetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }

      setDatasets((prev) => prev.filter((ds) => ds._id !== datasetId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred while deleting the dataset.");
    } finally {
      setDeletingId(null);
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
                </Grid>
                <Grid item xs={12} sm={4} textAlign="right">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(dataset._id)}
                    disabled={deletingId === dataset._id}
                  >
                    {deletingId === dataset._id ? "Deleting..." : "Delete"}
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {dataset.modelOutput?.original && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Original Image:
                  </Typography>
                  <a
                    href={dataset.modelOutput.original}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={dataset.modelOutput.original}
                      alt="original"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                        marginBottom: "0.5rem",
                        cursor: "zoom-in",
                      }}
                    />
                  </a>
                  <Button
                    variant="outlined"
                    size="small"
                    href={dataset.modelOutput.original}
                    download
                    startIcon={<DownloadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Download Original
                  </Button>
                </>
              )}

              {dataset.modelOutput?.annotated && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Predicted (Annotated):
                  </Typography>
                  <a
                    href={dataset.modelOutput.annotated}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={dataset.modelOutput.annotated}
                      alt="annotated"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                        marginBottom: "0.5rem",
                        cursor: "zoom-in",
                      }}
                    />
                  </a>
                  <Button
                    variant="outlined"
                    size="small"
                    href={dataset.modelOutput.annotated}
                    download
                    startIcon={<DownloadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Download Annotated
                  </Button>
                </>
              )}

              {dataset.modelOutput?.summary && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Prediction Summary:
                  </Typography>
                  <Typography color="text.secondary">
                    • Resting: {dataset.modelOutput.summary.Resting}
                    <br />• Surveilling:{" "}
                    {dataset.modelOutput.summary.Surveilling}
                    <br />• Activated: {dataset.modelOutput.summary.Activated}
                    <br />• Resolution: {dataset.modelOutput.summary.Resolution}
                  </Typography>
                </>
              )}
            </Paper>
          ))
        )}
      </Container>
    </Box>
  );
};

export default ViewPastResultsPage;
