import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import MultiFileUpload from "../components/MultiFileUpload";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UPLOAD_URL } from "../constants";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Upload size={32} className="text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-bold text-slate-800 mb-2"
            >
              Upload New Dataset
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-600"
            >
              Upload microscopic images and YOLO files for AI analysis
            </motion.p>
          </div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </motion.button>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dataset Name *
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter dataset name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter dataset description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Upload Images and YOLO Files
                </label>
                <MultiFileUpload
                  fileAssociations={fileAssociations}
                  setFileAssociations={setFileAssociations}
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit Dataset
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadDatasetPage;
