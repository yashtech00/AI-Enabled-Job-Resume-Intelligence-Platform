import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteResume, getResumes } from "../../api/resume.api";
import { motion, AnimatePresence } from "framer-motion";

export const ResumeList = () => {
  const [resumeList, setResumeList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleResumeList = async () => {
    try {
      const data = await getResumes();
      const normalizedResumes = Array.isArray(data)
        ? data
        : Array.isArray(data?.data?.resumes)
          ? data.data.resumes
          : Array.isArray(data?.resumes)
            ? data.resumes
            : [];
      setResumeList(normalizedResumes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleResumeList();
  }, []);

  const handleDelete = async (resumeId) => {
    setDeletingId(resumeId);
    setError(null);
    try {
      const data = await deleteResume(resumeId);
      if (data?.success === false) {
        setError(data?.message || "Failed to delete resume");
        return;
      }
      await handleResumeList();
    } catch (e) {
      setError("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Talent <span className="text-orange-500">Pool</span></h1>
            <p className="mt-2 text-gray-600">Manage your candidate database.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/resumes/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Upload Resume
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : resumeList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="mb-4 rounded-full bg-orange-50 p-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No resumes yet</h3>
            <p className="mt-1 text-gray-500 max-w-sm">Upload candidate resumes to start managing your talent pool.</p>
            <Link to="/resumes/upload" className="mt-6 text-orange-600 font-medium hover:underline">Upload your first resume</Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {resumeList.map((resume) => (
                <motion.div
                  key={resume._id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={deletingId === resume._id}
                      className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete Resume"
                    >
                      {deletingId === resume._id ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate" title={resume.candidateName || resume.name}>
                      {resume.candidateName || resume.name || "Unknown Candidate"}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{resume.email || "No email provided"}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                    <Link to={`/chat/${resume._id}`} className="w-full">
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Chat Profile
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;