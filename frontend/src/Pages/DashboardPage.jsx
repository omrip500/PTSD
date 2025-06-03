import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { User, UploadCloud, History, BarChart3, Brain } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar – Only on Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col items-center py-8 shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <User size={40} className="text-white" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg font-semibold mb-1"
          >
            {user.firstName} {user.lastName}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-slate-300 text-sm mb-6"
          >
            {user.email}
          </motion.p>

          <div className="w-4/5 h-px bg-slate-600 mb-6" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="border-2 border-white text-white hover:bg-white hover:text-slate-800 px-6 py-2 rounded-xl font-medium transition-all duration-200"
          >
            View Profile
          </motion.button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Show user summary at top */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-slate-600 mb-4">{user.email}</p>
                <button
                  onClick={() => navigate("/profile")}
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  View Profile
                </button>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-slate-800 mb-8"
            >
              Research Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Upload Dataset Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  Upload New Dataset
                </h3>
                <p className="text-slate-600 mb-6">
                  Upload microscopic images for AI analysis
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/uploadDataset")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Start Uploading
                </motion.button>
              </motion.div>

              {/* View Results Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <History size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  View Past Results
                </h3>
                <p className="text-slate-600 mb-6">
                  Access your previous analysis results
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/history")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  View Results
                </motion.button>
              </motion.div>

              {/* Analytics Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  Research Analytics
                </h3>
                <p className="text-slate-600 mb-6">
                  View detailed analysis statistics
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/history")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  View Analytics
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
