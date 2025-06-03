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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Archive as ArchiveIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { USERS_URL, BASE_URL, DATASET_URL } from "../constants";
import { toast } from "react-toastify";

const ViewPastResultsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingDataset, setEditingDataset] = useState(null); // datasetId being edited
  const [editDatasetValues, setEditDatasetValues] = useState({
    name: "",
    description: "",
  });

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

  const handleExportSingleDataset = async (datasetId, datasetName) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/export/dataset/${datasetId}/excel`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${datasetName.replace(/[^a-zA-Z0-9]/g, "_")}_results.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportAllDatasets = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/export/user/${user._id}/excel`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_datasets_results.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel file with all datasets downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  const handleDownloadZip = async (dataset) => {
    try {
      toast.info("Creating ZIP file... Please wait.");

      const response = await fetch(
        `${BASE_URL}/api/export/dataset/${dataset._id}/zip`
      );

      if (!response.ok) {
        throw new Error("ZIP export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataset.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}_images.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("ZIP file downloaded successfully!");
    } catch (error) {
      console.error("ZIP download error:", error);
      toast.error("Failed to download ZIP file");
    }
  };

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

  // Dataset edit functions
  const handleStartDatasetEdit = (
    datasetId,
    currentName,
    currentDescription
  ) => {
    setEditingDataset(datasetId);
    setEditDatasetValues({
      name: currentName || "",
      description: currentDescription || "",
    });
  };

  const handleCancelDatasetEdit = () => {
    setEditingDataset(null);
    setEditDatasetValues({ name: "", description: "" });
  };

  const handleSaveDatasetEdit = async () => {
    try {
      console.log("Saving dataset:", { editingDataset, editDatasetValues });

      const response = await fetch(`${DATASET_URL}/${editingDataset}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editDatasetValues.name,
          description: editDatasetValues.description,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error("Failed to update dataset");
      }

      // Update local state
      setDatasets((prev) =>
        prev.map((dataset) => {
          if (dataset._id === editingDataset) {
            return {
              ...dataset,
              name: editDatasetValues.name,
              description: editDatasetValues.description,
            };
          }
          return dataset;
        })
      );

      toast.success("Dataset updated successfully!");
      handleCancelDatasetEdit();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update dataset");
    }
  };

  return (
    <>
      <style>
        {`
          .results-grid .MuiGrid-item {
            margin-bottom: 24px !important;
            display: flex !important;
          }

          .results-grid .MuiPaper-root {
            width: 100%;
            display: flex;
            flex-direction: column;
          }

          .results-grid .MuiGrid-container {
            align-items: stretch;
          }
        `}
      </style>
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4">My Uploaded Datasets</Typography>
            {datasets.length > 0 && (
              <Button
                variant="contained"
                startIcon={<ExcelIcon />}
                onClick={handleExportAllDatasets}
                sx={{ bgcolor: "#0f3460" }}
              >
                Export All to Excel
              </Button>
            )}
          </Box>

          {loading ? (
            <CircularProgress />
          ) : datasets.length === 0 ? (
            <Typography>No datasets found.</Typography>
          ) : (
            datasets.map((dataset) => (
              <Paper key={dataset._id} elevation={4} sx={{ p: 4, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    {editingDataset === dataset._id ? (
                      <Box>
                        <TextField
                          fullWidth
                          value={editDatasetValues.name}
                          onChange={(e) =>
                            setEditDatasetValues((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                          placeholder="Dataset name"
                        />
                        <TextField
                          fullWidth
                          value={editDatasetValues.description}
                          onChange={(e) =>
                            setEditDatasetValues((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          variant="outlined"
                          size="small"
                          placeholder="Dataset description"
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">{dataset.name}</Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleStartDatasetEdit(
                                dataset._id,
                                dataset.name,
                                dataset.description
                              )
                            }
                            sx={{ color: "#0f3460" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography color="text.secondary">
                          {dataset.description}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4} textAlign="right">
                    {editingDataset === dataset._id ? (
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <IconButton
                          onClick={handleSaveDatasetEdit}
                          sx={{ color: "green" }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={handleCancelDatasetEdit}
                          sx={{ color: "red" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(dataset._id)}
                        disabled={deletingId === dataset._id}
                      >
                        {deletingId === dataset._id ? "Deleting..." : "Delete"}
                      </Button>
                    )}
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

                {/* Export Buttons */}
                <Divider sx={{ my: 3 }} />
                <Box display="flex" justifyContent="center" gap={2} mb={2}>
                  <Button
                    variant="contained"
                    startIcon={<ExcelIcon />}
                    onClick={() =>
                      handleExportSingleDataset(dataset._id, dataset.name)
                    }
                    sx={{ bgcolor: "#0f3460" }}
                  >
                    Export Results to Excel
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                    onClick={() => handleDownloadZip(dataset)}
                    sx={{ borderColor: "#0f3460", color: "#0f3460" }}
                  >
                    Download Images ZIP
                  </Button>
                </Box>

                {/* Results Section */}
                <Divider sx={{ my: 2 }} />

                {/* Check if it's multiple files or single file */}
                {dataset.modelOutput?.results &&
                dataset.modelOutput.results.length > 0 ? (
                  // Multiple files dataset
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Analysis Results ({dataset.modelOutput.results.length}{" "}
                      files)
                    </Typography>

                    {/* Total Summary */}
                    {dataset.modelOutput.totalSummary && (
                      <Paper
                        elevation={1}
                        sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa" }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Total Summary:
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          {Object.entries(dataset.modelOutput.totalSummary).map(
                            ([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                color="primary"
                                variant="outlined"
                              />
                            )
                          )}
                        </Stack>
                      </Paper>
                    )}

                    {/* Individual Results */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            View File Results (
                            {dataset.modelOutput.results.length} files)
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666", mt: 0.5 }}
                          >
                            Results are displayed in a responsive grid layout
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid
                          container
                          spacing={2}
                          className="results-grid"
                          sx={{
                            "& .MuiGrid-item": {
                              marginBottom: "24px !important",
                            },
                          }}
                        >
                          {dataset.modelOutput.results.map((result, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              xl={2}
                              key={index}
                              sx={{
                                display: "flex",
                                marginBottom: 2,
                              }}
                            >
                              <Paper
                                elevation={3}
                                sx={{
                                  p: 1.5,
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  borderRadius: 2,
                                  transition: "all 0.3s ease-in-out",
                                  "&:hover": {
                                    elevation: 6,
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                  },
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    color: "#0f3460",
                                    fontWeight: "bold",
                                    borderBottom: "1px solid #e0e0e0",
                                    pb: 0.5,
                                    mb: 1,
                                    fontSize: "1rem",
                                  }}
                                >
                                  File {index + 1}
                                </Typography>

                                {/* File Names */}
                                <Box sx={{ mb: 1 }}>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={0.5}
                                  >
                                    <ImageIcon
                                      sx={{
                                        mr: 0.5,
                                        fontSize: 14,
                                        color: "#0f3460",
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: "#666",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={result.imageName || "N/A"}
                                    >
                                      {result.imageName || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={0.5}
                                  >
                                    <DescriptionIcon
                                      sx={{
                                        mr: 0.5,
                                        fontSize: 14,
                                        color: "#0f3460",
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: "#666",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={result.yoloName || "N/A"}
                                    >
                                      {result.yoloName || "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Images Stacked */}
                                <Box sx={{ mb: 1 }}>
                                  {/* Original Image */}
                                  {result.original && (
                                    <Box sx={{ mb: 1 }}>
                                      <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "0.7rem",
                                          mb: 0.5,
                                        }}
                                      >
                                        Original:
                                      </Typography>
                                      <a
                                        href={result.original}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          src={result.original}
                                          alt={`original-${index}`}
                                          style={{
                                            width: "100%",
                                            height: 120,
                                            objectFit: "cover",
                                            cursor: "zoom-in",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "8px",
                                            transition:
                                              "transform 0.2s ease-in-out",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.transform =
                                              "scale(1.02)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.transform =
                                              "scale(1)";
                                          }}
                                        />
                                      </a>
                                    </Box>
                                  )}

                                  {/* Annotated Image */}
                                  {result.annotated && (
                                    <Box sx={{ mb: 1 }}>
                                      <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "0.7rem",
                                          mb: 0.5,
                                        }}
                                      >
                                        Predicted:
                                      </Typography>
                                      <a
                                        href={result.annotated}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          src={result.annotated}
                                          alt={`annotated-${index}`}
                                          style={{
                                            width: "100%",
                                            height: 120,
                                            objectFit: "cover",
                                            cursor: "zoom-in",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "8px",
                                            transition:
                                              "transform 0.2s ease-in-out",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.transform =
                                              "scale(1.02)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.transform =
                                              "scale(1)";
                                          }}
                                        />
                                      </a>
                                    </Box>
                                  )}
                                </Box>

                                {/* Results Summary */}
                                {result.summary && (
                                  <Box sx={{ mt: "auto", pt: 1 }}>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#0f3460",
                                        borderTop: "1px solid #e0e0e0",
                                        pt: 0.5,
                                        mb: 0.5,
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      Results:
                                    </Typography>
                                    <Stack
                                      direction="row"
                                      spacing={0.5}
                                      flexWrap="wrap"
                                      sx={{ gap: 0.5 }}
                                    >
                                      {Object.entries(result.summary).map(
                                        ([key, value]) => (
                                          <Chip
                                            key={key}
                                            label={`${key}: ${value}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              fontSize: "0.7rem",
                                              height: 24,
                                              borderColor: "#0f3460",
                                              color: "#0f3460",
                                              "&:hover": {
                                                backgroundColor: "#0f3460",
                                                color: "white",
                                              },
                                            }}
                                          />
                                        )
                                      )}
                                    </Stack>
                                  </Box>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </>
                ) : dataset.modelOutput?.summary ? (
                  // Single file dataset (backward compatibility)
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Analysis Results:
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        {Object.entries(dataset.modelOutput.summary).map(
                          ([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${value}`}
                              color="primary"
                              variant="outlined"
                            />
                          )
                        )}
                      </Stack>
                    </Paper>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No analysis results available
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </Container>
      </Box>
    </>
  );
};

export default ViewPastResultsPage;
