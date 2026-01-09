import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../api/job.api";
import { motion } from "framer-motion";

export const JobsList = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);

  const truncateWords = (text, maxWords = 25) => {
    const value = (text ?? "").toString().trim();
    if (!value) return "";
    const words = value.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return value;
    return `${words.slice(0, maxWords).join(" ")}...`;
  };

  const handleJobList = async () => {
    try {
      const data = await getAllJobs();
      const normalizedJobs = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
          ? data.jobs
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setJobList(normalizedJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleJobList();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Job <span className="text-blue-600">Openings</span>
            </h1>
            <p className="mt-2 text-gray-600">Find and manage your open positions.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/jobs/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Post New Job
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : jobList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
            <p className="mt-1 text-gray-500 max-w-sm">Get started by creating a new job posting to find the perfect candidate.</p>
            <Link to="/jobs/create" className="mt-6 text-blue-600 font-medium hover:underline">Create your first job</Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {jobList.map((job) => (
              <motion.div
                key={job._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      Active
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1" title={job.jobTitle ?? job.title}>
                    {job.jobTitle ?? job.title}
                  </h3>

                  <p className="mb-6 text-sm text-gray-500 line-clamp-3">
                    {truncateWords(job.jobDescription ?? job.description, 20)}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <Link to={`/matches/${job._id}`} className="flex-1">
                    <button className="w-full rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors">
                      Match Candidates
                    </button>
                  </Link>
                  <Link to={`/jobs/${job._id}`}>
                    <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsList;