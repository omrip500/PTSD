import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Microscope,
  BarChart3,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Analysis",
      description:
        "Advanced neural networks for precise microglial cell classification and PTSD research insights.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Microscope size={32} />,
      title: "Microscopic Precision",
      description:
        "High-resolution image analysis with YOLO-based segmentation for accurate cell detection.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Research Analytics",
      description:
        "Comprehensive data visualization and export capabilities for academic research.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security for sensitive research data with full compliance.",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "80.8%", label: "Model Accuracy", icon: <Target size={20} /> },
    {
      number: "1000+",
      label: "Cells Analyzed",
      icon: <Microscope size={20} />,
    },
    { number: "50+", label: "Research Papers", icon: <TrendingUp size={20} /> },
    { number: "24/7", label: "System Uptime", icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full font-medium">
              <Brain size={16} />
              <span>Advanced PTSD Research Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PTSD Research
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Harness the power of AI to analyze microglial cell activation
              patterns, advancing our understanding of PTSD inflammation
              mechanisms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Research
                  <ArrowRight size={20} />
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  <Users size={20} />
                  Join Community
                </button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 shadow-lg z-10"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 left-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 shadow-lg z-10"
              >
                <Microscope className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6 shadow-xl z-10"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              {/* Main Visual */}
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
                  <Zap className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    Neural Analysis Engine
                  </h3>
                  <p className="opacity-90">
                    Real-time AI processing for breakthrough research
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">
                    {stat.number}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Cutting-Edge Research Tools
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover how our advanced AI platform transforms PTSD research
            through innovative microglial cell analysis and neural network
            processing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <div className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-2xl p-8 text-center">
                <div
                  className={`bg-gradient-to-r ${feature.gradient} rounded-2xl p-4 w-fit mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Advance Your Research?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join leading researchers worldwide who trust our platform for
              groundbreaking PTSD and neuroinflammation studies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                >
                  Get Started Today
                  <ArrowRight size={20} />
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                >
                  Sign In
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
