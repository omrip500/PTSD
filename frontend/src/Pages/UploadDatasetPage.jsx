// UploadDatasetPage.jsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Fade,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UPLOAD_URL } from "../constants";

const DropZoneStyle = styled(Box)(({ theme }) => ({
  border: "2px dashed #ccc",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  height: 150,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#666",
  backgroundColor: "#fafafa",
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const PreviewImage = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1),
}));

const UploadDatasetPage = () => {
  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [groupType, setGroupType] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datasetName || !groupType || images.length === 0) {
      toast.error("Please fill all fields and upload at least one image.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", datasetName);
    formData.append("description", description);
    formData.append("groupType", groupType);
    formData.append("userId", user._id);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);
      const response = await fetch(`${UPLOAD_URL}/dataset`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      toast.success("Dataset uploaded successfully!");

      // Reset form
      setDatasetName("");
      setDescription("");
      setGroupType("");
      setImages([]);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 5 }}>
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Upload New Dataset
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <TextField
                    label="Dataset Name"
                    fullWidth
                    required
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label="Group Type"
                    select
                    fullWidth
                    required
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value)}
                  >
                    <MenuItem value="control">Control</MenuItem>
                    <MenuItem value="experiment">Experiment</MenuItem>
                  </TextField>
                </Grid>

                <Grid item>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                <Grid item>
                  <DropZoneStyle {...getRootProps()}>
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>
                      {isDragActive
                        ? "Drop the images here..."
                        : "Drag and drop images here, or click to select files"}
                    </Typography>
                  </DropZoneStyle>
                </Grid>

                {images.length > 0 && (
                  <Grid item>
                    <Typography variant="subtitle1" gutterBottom>
                      Preview:
                    </Typography>
                    <Stack direction="row" flexWrap="wrap">
                      {images.map((file, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                          <PreviewImage
                            src={URL.createObjectURL(file)}
                            alt="preview"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              "&:hover": {
                                backgroundColor: "#fff",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                )}

                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ fontWeight: "bold", py: 1.5 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Dataset"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default UploadDatasetPage;
