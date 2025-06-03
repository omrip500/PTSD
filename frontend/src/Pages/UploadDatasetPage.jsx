import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../components/Navbar";
import MultiFileUpload from "../components/MultiFileUpload";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UPLOAD_URL } from "../constants";

const FileInput = styled("input")({
  display: "none",
});

const UploadDatasetPage = () => {
  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [fileAssociations, setFileAssociations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datasetName || fileAssociations.length === 0) {
      toast.error(
        "Please fill all fields and upload at least one image-YOLO pair."
      );
      return;
    }

    // Validate that all associations have both image and YOLO file
    const invalidAssociations = fileAssociations.filter(
      (assoc) => !assoc.image || !assoc.yolo
    );
    if (invalidAssociations.length > 0) {
      toast.error("Please ensure all images have associated YOLO files.");
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
    formData.append("userId", user._id);

    // Add all file associations
    fileAssociations.forEach((association, index) => {
      formData.append(`images`, association.image);
      formData.append(`yolos`, association.yolo);
      formData.append(
        `associations[${index}]`,
        JSON.stringify({
          imageIndex: index,
          yoloIndex: index,
          imageName: association.image.name,
          yoloName: association.yolo.name,
        })
      );
    });

    try {
      setLoading(true);
      const response = await fetch(`${UPLOAD_URL}/dataset-multiple`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      toast.success("Dataset uploaded and analyzed successfully!");
      setDatasetName("");
      setDescription("");
      setFileAssociations([]);
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
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                <Grid item>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Images and YOLO Files:
                  </Typography>
                  <MultiFileUpload
                    fileAssociations={fileAssociations}
                    setFileAssociations={setFileAssociations}
                  />
                </Grid>

                <Grid item>
                  <Stack direction="row" justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ fontWeight: "bold", px: 4, py: 1.5 }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Dataset"
                      )}
                    </Button>
                  </Stack>
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
