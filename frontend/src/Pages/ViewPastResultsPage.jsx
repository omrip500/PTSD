import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ChevronDown,
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Archive,
  Edit3,
  Check,
  X,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { USERS_URL, BASE_URL, DATASET_URL } from "../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewPastResultsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingDataset, setEditingDataset] = useState(null);
  const [editDatasetValues, setEditDatasetValues] = useState({
    name: "",
    description: "",
  });
  const [expandedDatasets, setExpandedDatasets] = useState(new Set());

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch(`${USERS_URL}/datasets/${user._id}`);
        const data = await response.json();
        setDatasets(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
        toast.error("Failed to load datasets");
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
    if (
      !window.confirm(
        "Are you sure you want to delete this dataset? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(datasetId);
      const response = await fetch(`${DATASET_URL}/${datasetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }

      setDatasets((prev) => prev.filter((ds) => ds._id !== datasetId));
      toast.success("Dataset deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete dataset");
    } finally {
      setDeletingId(null);
    }
  };

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

      if (!response.ok) {
        throw new Error("Failed to update dataset");
      }

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

  const toggleDatasetExpansion = (datasetId) => {
    setExpandedDatasets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(datasetId)) {
        newSet.delete(datasetId);
      } else {
        newSet.add(datasetId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-slate-600">Loading your datasets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />
      <div className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </motion.button>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-slate-800"
              >
                My Research Results
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-slate-600 mt-2"
              >
                View and manage your analyzed datasets
              </motion.p>
            </div>

            {datasets.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportAllDatasets}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
              >
                <FileSpreadsheet size={20} />
                Export All to Excel
              </motion.button>
            )}
          </div>

          {/* Content */}
          <AnimatePresence>
            {datasets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                  No Datasets Found
                </h3>
                <p className="text-slate-600 mb-8">
                  You haven't uploaded any datasets yet. Start by uploading your
                  first dataset.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/uploadDataset")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Upload Dataset
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {datasets.map((dataset, index) => (
                  <DatasetCard
                    key={dataset._id}
                    dataset={dataset}
                    index={index}
                    editingDataset={editingDataset}
                    editDatasetValues={editDatasetValues}
                    setEditDatasetValues={setEditDatasetValues}
                    deletingId={deletingId}
                    expandedDatasets={expandedDatasets}
                    handleStartDatasetEdit={handleStartDatasetEdit}
                    handleSaveDatasetEdit={handleSaveDatasetEdit}
                    handleCancelDatasetEdit={handleCancelDatasetEdit}
                    handleDelete={handleDelete}
                    toggleDatasetExpansion={toggleDatasetExpansion}
                    handleExportSingleDataset={handleExportSingleDataset}
                    handleDownloadZip={handleDownloadZip}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Dataset Card Component
const DatasetCard = ({
  dataset,
  index,
  editingDataset,
  editDatasetValues,
  setEditDatasetValues,
  deletingId,
  expandedDatasets,
  handleStartDatasetEdit,
  handleSaveDatasetEdit,
  handleCancelDatasetEdit,
  handleDelete,
  toggleDatasetExpansion,
  handleExportSingleDataset,
  handleDownloadZip,
}) => {
  const isExpanded = expandedDatasets.has(dataset._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden"
    >
      {/* Dataset Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            {editingDataset === dataset._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editDatasetValues.name}
                  onChange={(e) =>
                    setEditDatasetValues((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-semibold text-lg"
                  placeholder="Dataset name"
                />
                <textarea
                  value={editDatasetValues.description}
                  onChange={(e) =>
                    setEditDatasetValues((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={2}
                  placeholder="Dataset description"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {dataset.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleStartDatasetEdit(
                        dataset._id,
                        dataset.name,
                        dataset.description
                      )
                    }
                    className="text-slate-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Edit3 size={16} />
                  </motion.button>
                </div>
                <p className="text-slate-600">
                  {dataset.description || "No description provided"}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editingDataset === dataset._id ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveDatasetEdit}
                  className="text-green-600 hover:text-green-700 transition-colors duration-200 p-2"
                >
                  <Check size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancelDatasetEdit}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200 p-2"
                >
                  <X size={20} />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDatasetExpansion(dataset._id)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(dataset._id)}
                  disabled={deletingId === dataset._id}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    deletingId === dataset._id
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  {deletingId === dataset._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-200"
          >
            <div className="p-6 space-y-6">
              {/* Export Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleExportSingleDataset(dataset._id, dataset.name)
                  }
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  <FileSpreadsheet size={20} />
                  Export to Excel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadZip(dataset)}
                  className="inline-flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  <Archive size={20} />
                  Download ZIP
                </motion.button>
              </div>

              {/* Images */}
              {(dataset.modelOutput?.original ||
                dataset.modelOutput?.annotated) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dataset.modelOutput?.original && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <ImageIcon size={20} />
                        Original Image
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <a
                          href={dataset.modelOutput.original}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={dataset.modelOutput.original}
                            alt="Original"
                            className="w-full h-64 object-contain rounded-lg cursor-zoom-in hover:shadow-lg transition-shadow duration-200"
                          />
                        </a>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={dataset.modelOutput.original}
                          download
                          className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                          <Download size={16} />
                          Download Original
                        </motion.a>
                      </div>
                    </div>
                  )}

                  {dataset.modelOutput?.annotated && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <ImageIcon size={20} />
                        Predicted (Annotated)
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <a
                          href={dataset.modelOutput.annotated}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={dataset.modelOutput.annotated}
                            alt="Annotated"
                            className="w-full h-64 object-contain rounded-lg cursor-zoom-in hover:shadow-lg transition-shadow duration-200"
                          />
                        </a>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={dataset.modelOutput.annotated}
                          download
                          className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                          <Download size={16} />
                          Download Annotated
                        </motion.a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results Summary */}
              {dataset.modelOutput?.totalSummary && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Analysis Summary
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(dataset.modelOutput.totalSummary).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-white px-4 py-2 rounded-xl border border-blue-200 shadow-sm"
                        >
                          <span className="text-sm font-medium text-slate-600">
                            {key}:
                          </span>
                          <span className="ml-2 text-lg font-bold text-blue-600">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Individual Results */}
              {dataset.modelOutput?.results &&
                dataset.modelOutput.results.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800">
                      Individual Results ({dataset.modelOutput.results.length}{" "}
                      files)
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {dataset.modelOutput.results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-slate-50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-slate-800 truncate">
                              {result.filename || `Result ${index + 1}`}
                            </h5>
                            {result.confidence && (
                              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                                {(result.confidence * 100).toFixed(1)}%
                                confidence
                              </span>
                            )}
                          </div>

                          {result.detections && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.detections).map(
                                ([detection, count]) => (
                                  <div
                                    key={detection}
                                    className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm"
                                  >
                                    <span className="text-slate-600">
                                      {detection}:
                                    </span>
                                    <span className="ml-1 font-semibold text-slate-800">
                                      {count}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ViewPastResultsPage;
