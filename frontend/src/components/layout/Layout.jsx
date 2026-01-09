import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-white py-6"}`}>
      <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-gray-900 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">AI</div>
          <span>Resume<span className="text-orange-500">Intelli</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Find Jobs</Link>
          <Link to="/resumes" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Talent Pool</Link>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/jobs">
            <button className="px-5 py-2.5 text-blue-600 font-semibold hover:bg-blue-50 rounded-full transition-colors">
              Jobs
            </button>
          </Link>
          <Link to="/resumes">
            <button className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30">
              Resumes
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link to="/" className="text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/jobs" className="text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Find Jobs</Link>
              <Link to="/resumes" className="text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Talent Pool</Link>
              <hr />
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 text-blue-600 font-bold border border-blue-100 rounded-lg">Jobs</button>
              </Link>
              <Link to="/resumes" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg">Resumes</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
    </div>
  );
};

export default Layout;
