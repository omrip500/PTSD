import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  IconButton,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const FileInput = styled("input")({
  display: "none",
});

const DropZone = styled(Paper)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? "#1976d2" : "#ccc"}`,
  borderRadius: 8,
  padding: 24,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: isDragOver ? "#f5f5f5" : "transparent",
  "&:hover": {
    borderColor: "#1976d2",
    backgroundColor: "#f9f9f9",
  },
}));

const AssociationCard = styled(Card)(({ theme }) => ({
  marginBottom: 16,
  border: "1px solid #e0e0e0",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

const DraggableFileChip = styled(Chip)(({ isDragging, isDropTarget }) => ({
  cursor: "grab",
  transition: "all 0.3s ease",
  transform: isDragging ? "scale(1.05)" : "scale(1)",
  opacity: isDragging ? 0.8 : 1,
  border: isDropTarget ? "2px dashed #1976d2" : "1px solid #e0e0e0",
  backgroundColor: isDropTarget ? "#e3f2fd" : "transparent",
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    backgroundColor: isDropTarget ? "#bbdefb" : "#f5f5f5",
  },
}));

const MultiFileUpload = ({ fileAssociations, setFileAssociations }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedYolos, setUploadedYolos] = useState([]);

  // Drag and drop association states
  const [draggedFile, setDraggedFile] = useState(null);
  const [draggedFileType, setDraggedFileType] = useState(null);
  const [dropTargetFile, setDropTargetFile] = useState(null);
  const [dropTargetType, setDropTargetType] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    sourceFile: null,
    targetFile: null,
    sourceType: null,
    targetType: null,
  });

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleYoloUpload = (files) => {
    const newYolos = Array.from(files).filter((file) =>
      file.name.endsWith(".txt")
    );
    setUploadedYolos((prev) => [...prev, ...newYolos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;

    const images = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const yolos = Array.from(files).filter((file) =>
      file.name.endsWith(".txt")
    );

    if (images.length > 0) handleImageUpload(images);
    if (yolos.length > 0) handleYoloUpload(yolos);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Drag and drop handlers for file association
  const handleFileDragStart = (file, fileType) => {
    setDraggedFile(file);
    setDraggedFileType(fileType);
  };

  const handleFileDragEnd = () => {
    setDraggedFile(null);
    setDraggedFileType(null);
    setDropTargetFile(null);
    setDropTargetType(null);
  };

  const handleFileDragOver = (e, file, fileType) => {
    e.preventDefault();
    // Only allow drop if dragging different file types
    if (draggedFileType && draggedFileType !== fileType) {
      setDropTargetFile(file);
      setDropTargetType(fileType);
    }
  };

  const handleFileDragLeave = () => {
    setDropTargetFile(null);
    setDropTargetType(null);
  };

  const handleFileDrop = (e, targetFile, targetType) => {
    e.preventDefault();

    if (draggedFile && draggedFileType !== targetType) {
      // Open confirmation dialog
      setConfirmDialog({
        open: true,
        sourceFile: draggedFile,
        targetFile: targetFile,
        sourceType: draggedFileType,
        targetType: targetType,
      });
    }

    handleFileDragEnd();
  };

  const confirmAssociation = () => {
    const { sourceFile, targetFile, sourceType } = confirmDialog;

    let image, yolo;
    if (sourceType === "image") {
      image = sourceFile;
      yolo = targetFile;
    } else {
      image = targetFile;
      yolo = sourceFile;
    }

    createAssociation(image, yolo);
    setConfirmDialog({
      open: false,
      sourceFile: null,
      targetFile: null,
      sourceType: null,
      targetType: null,
    });
  };

  const cancelAssociation = () => {
    setConfirmDialog({
      open: false,
      sourceFile: null,
      targetFile: null,
      sourceType: null,
      targetType: null,
    });
  };

  const createAssociation = (image, yolo) => {
    const newAssociation = {
      id: Date.now() + Math.random(),
      image,
      yolo,
    };
    setFileAssociations((prev) => [...prev, newAssociation]);

    // Remove files from unassociated lists
    setUploadedImages((prev) => prev.filter((img) => img !== image));
    setUploadedYolos((prev) => prev.filter((y) => y !== yolo));
  };

  const removeAssociation = (id) => {
    const association = fileAssociations.find((assoc) => assoc.id === id);
    if (association) {
      setUploadedImages((prev) => [...prev, association.image]);
      setUploadedYolos((prev) => [...prev, association.yolo]);
    }
    setFileAssociations((prev) => prev.filter((assoc) => assoc.id !== id));
  };

  const removeUnassociatedFile = (file, type) => {
    if (type === "image") {
      setUploadedImages((prev) => prev.filter((img) => img !== file));
    } else {
      setUploadedYolos((prev) => prev.filter((y) => y !== file));
    }
  };

  return (
    <Box>
      {/* Upload Area */}
      <DropZone
        isDragOver={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        elevation={0}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "#666", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag & Drop Files Here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Or click to browse files
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <label htmlFor="image-upload-multiple">
            <FileInput
              accept="image/*"
              id="image-upload-multiple"
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<ImageIcon />}
            >
              Upload Images
            </Button>
          </label>

          <label htmlFor="yolo-upload-multiple">
            <FileInput
              accept=".txt"
              id="yolo-upload-multiple"
              type="file"
              multiple
              onChange={(e) => handleYoloUpload(e.target.files)}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<DescriptionIcon />}
            >
              Upload YOLO Files
            </Button>
          </label>
        </Stack>
      </DropZone>

      {/* File Associations */}
      {fileAssociations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            File Associations ({fileAssociations.length})
          </Typography>
          {fileAssociations.map((association) => (
            <AssociationCard key={association.id}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={5}>
                    <Box display="flex" alignItems="center">
                      <ImageIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="body2" noWrap>
                        {association.image.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={1} textAlign="center">
                    <LinkIcon color="action" />
                  </Grid>
                  <Grid item xs={5}>
                    <Box display="flex" alignItems="center">
                      <DescriptionIcon sx={{ mr: 1, color: "#ff9800" }} />
                      <Typography variant="body2" noWrap>
                        {association.yolo.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeAssociation(association.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </AssociationCard>
          ))}
        </Box>
      )}

      {/* Unassociated Files */}
      {(uploadedImages.length > 0 || uploadedYolos.length > 0) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Unassociated Files
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Drag an image onto a YOLO file (or vice versa) to create an
            association
          </Alert>

          {uploadedImages.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Images (drag to YOLO files to associate):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {uploadedImages.map((image, index) => (
                  <DraggableFileChip
                    key={index}
                    label={image.name}
                    icon={<ImageIcon />}
                    onDelete={() => removeUnassociatedFile(image, "image")}
                    draggable
                    onDragStart={() => handleFileDragStart(image, "image")}
                    onDragEnd={handleFileDragEnd}
                    onDragOver={(e) => handleFileDragOver(e, image, "image")}
                    onDragLeave={handleFileDragLeave}
                    onDrop={(e) => handleFileDrop(e, image, "image")}
                    isDragging={draggedFile === image}
                    isDropTarget={dropTargetFile === image}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {uploadedYolos.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                YOLO Files (drag to images to associate):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {uploadedYolos.map((yolo, index) => (
                  <DraggableFileChip
                    key={index}
                    label={yolo.name}
                    icon={<DescriptionIcon />}
                    onDelete={() => removeUnassociatedFile(yolo, "yolo")}
                    draggable
                    onDragStart={() => handleFileDragStart(yolo, "yolo")}
                    onDragEnd={handleFileDragEnd}
                    onDragOver={(e) => handleFileDragOver(e, yolo, "yolo")}
                    onDragLeave={handleFileDragLeave}
                    onDrop={(e) => handleFileDrop(e, yolo, "yolo")}
                    isDragging={draggedFile === yolo}
                    isDropTarget={dropTargetFile === yolo}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={cancelAssociation}>
        <DialogTitle>Confirm File Association</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Do you want to associate these files?
            </Typography>

            <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <Box display="flex" alignItems="center">
                    <ImageIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography variant="body2" noWrap>
                      {confirmDialog.sourceType === "image"
                        ? confirmDialog.sourceFile?.name
                        : confirmDialog.targetFile?.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2} textAlign="center">
                  <LinkIcon color="action" />
                </Grid>
                <Grid item xs={5}>
                  <Box display="flex" alignItems="center">
                    <DescriptionIcon sx={{ mr: 1, color: "#ff9800" }} />
                    <Typography variant="body2" noWrap>
                      {confirmDialog.sourceType === "yolo"
                        ? confirmDialog.sourceFile?.name
                        : confirmDialog.targetFile?.name}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelAssociation}
            startIcon={<CancelIcon />}
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmAssociation}
            startIcon={<CheckIcon />}
            variant="contained"
            color="primary"
          >
            Confirm Association
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiFileUpload;
