import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  Trash2,
  Image,
  FileText,
  Link,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

// File chip component for drag and drop
const DraggableFileChip = ({
  file,
  type,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isDropTarget,
}) => {
  const Icon = type === "image" ? Image : FileText;
  const bgColor =
    type === "image"
      ? "from-blue-500 to-cyan-500"
      : "from-orange-500 to-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isDragging ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing mb-2 mr-2
        ${isDragging ? "opacity-80 shadow-lg" : "opacity-100"}
        ${
          isDropTarget
            ? "border-blue-500 bg-blue-50 border-dashed"
            : "border-slate-300 bg-white hover:bg-slate-50"
        }
      `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={`w-6 h-6 rounded-full bg-gradient-to-r ${bgColor} flex items-center justify-center`}
      >
        <Icon size={14} className="text-white" />
      </div>
      <span className="text-sm font-medium text-slate-700 max-w-32 truncate">
        {file.name}
      </span>
      <button
        onClick={onDelete}
        className="text-slate-400 hover:text-red-500 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const MultiFileUpload = ({ fileAssociations, setFileAssociations }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedYolos, setUploadedYolos] = useState([]);

  // Drag and drop association states
  const [draggedFile, setDraggedFile] = useState(null);
  const [draggedFileType, setDraggedFileType] = useState(null);
  const [dropTargetFile, setDropTargetFile] = useState(null);

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
  };

  const handleFileDragOver = (e, file, fileType) => {
    e.preventDefault();
    // Only allow drop if dragging different file types
    if (draggedFileType && draggedFileType !== fileType) {
      setDropTargetFile(file);
    }
  };

  const handleFileDragLeave = () => {
    setDropTargetFile(null);
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
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CloudUpload
          size={48}
          className={`mx-auto mb-4 ${
            dragOver ? "text-blue-500" : "text-slate-400"
          }`}
        />
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Drag & Drop Files Here
        </h3>
        <p className="text-slate-600 mb-6">Or click to browse files</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <label htmlFor="image-upload-multiple">
            <input
              accept="image/*"
              id="image-upload-multiple"
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer"
            >
              <Image size={20} />
              Upload Images
            </motion.div>
          </label>

          <label htmlFor="yolo-upload-multiple">
            <input
              accept=".txt"
              id="yolo-upload-multiple"
              type="file"
              multiple
              onChange={(e) => handleYoloUpload(e.target.files)}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer"
            >
              <FileText size={20} />
              Upload YOLO Files
            </motion.div>
          </label>
        </div>
      </motion.div>

      {/* File Associations */}
      <AnimatePresence>
        {fileAssociations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              File Associations ({fileAssociations.length})
            </h3>
            <div className="space-y-3">
              {fileAssociations.map((association) => (
                <motion.div
                  key={association.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Image size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {association.image.name}
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <Link size={20} className="text-slate-400" />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <FileText size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {association.yolo.name}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeAssociation(association.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors duration-200 p-1"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unassociated Files */}
      <AnimatePresence>
        {(uploadedImages.length > 0 || uploadedYolos.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              Unassociated Files
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-blue-600" />
              <p className="text-blue-800 text-sm">
                Drag an image onto a YOLO file (or vice versa) to create an
                association
              </p>
            </div>

            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-medium text-slate-700">
                  Images (drag to YOLO files to associate):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((image, index) => (
                    <DraggableFileChip
                      key={index}
                      file={image}
                      type="image"
                      onDelete={() => removeUnassociatedFile(image, "image")}
                      onDragStart={() => handleFileDragStart(image, "image")}
                      onDragEnd={handleFileDragEnd}
                      onDragOver={(e) => handleFileDragOver(e, image, "image")}
                      onDragLeave={handleFileDragLeave}
                      onDrop={(e) => handleFileDrop(e, image, "image")}
                      isDragging={draggedFile === image}
                      isDropTarget={dropTargetFile === image}
                    />
                  ))}
                </div>
              </div>
            )}

            {uploadedYolos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-medium text-slate-700">
                  YOLO Files (drag to images to associate):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedYolos.map((yolo, index) => (
                    <DraggableFileChip
                      key={index}
                      file={yolo}
                      type="yolo"
                      onDelete={() => removeUnassociatedFile(yolo, "yolo")}
                      onDragStart={() => handleFileDragStart(yolo, "yolo")}
                      onDragEnd={handleFileDragEnd}
                      onDragOver={(e) => handleFileDragOver(e, yolo, "yolo")}
                      onDragLeave={handleFileDragLeave}
                      onDrop={(e) => handleFileDrop(e, yolo, "yolo")}
                      isDragging={draggedFile === yolo}
                      isDropTarget={dropTargetFile === yolo}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={cancelAssociation}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Confirm File Association
              </h3>

              <p className="text-slate-600 mb-6">
                Do you want to associate these files?
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Image size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {confirmDialog.sourceType === "image"
                        ? confirmDialog.sourceFile?.name
                        : confirmDialog.targetFile?.name}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <Link size={16} className="text-slate-400" />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <FileText size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {confirmDialog.sourceType === "yolo"
                        ? confirmDialog.sourceFile?.name
                        : confirmDialog.targetFile?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelAssociation}
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <X size={16} />
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAssociation}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <Check size={16} />
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiFileUpload;
