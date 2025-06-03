import React, { useState, useEffect } from "react";
import {
  Brain,
  BarChart3,
  Upload,
  History,
  User,
  Sparkles,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 size={16} />,
    },
    {
      label: "Upload",
      path: "/uploadDataset",
      icon: <Upload size={16} />,
    },
    {
      label: "Results",
      path: "/history",
      icon: <History size={16} />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <User size={16} />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <Brain size={32} className="text-white" />
              </div>
              <Link
                to="/"
                className="text-slate-800 font-bold text-xl no-underline hover:text-blue-600 transition-colors duration-200"
              >
                PTSD Research
              </Link>
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                <Sparkles size={12} />
                <span>AI</span>
              </div>
            </motion.div>

            {/* Desktop View - Logged In */}
            {!isMobile && userInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Link
                      to={item.path}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                        ${
                          isActive(item.path)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        }
                      `}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-slate-500 border border-slate-300 hover:text-red-500 hover:border-red-300 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <LogOut size={20} />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Desktop View - Not Logged In */}
            {!isMobile && !userInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-6 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-2 font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* Mobile View - Hamburger Icon */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-slate-800">Navigation</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {userInfo ? (
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${
                          isActive(item.path)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        }
                      `}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-200 my-4" />
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 w-full transition-all duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
