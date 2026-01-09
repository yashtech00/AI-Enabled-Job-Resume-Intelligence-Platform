import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../../api/job.api";
import { motion } from "framer-motion";

export const JobDetail = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleJobDetails = async () => {
    try {
      const data = await getJobById(jobId);
      setJobDetails(data || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleJobDetails();
  }, [jobId]);

  const jobData = jobDetails?.data;
  const job = Array.isArray(jobData) ? jobData?.[0] : jobData;

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  if (!job) return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h2 className="text-xl font-bold text-gray-900">Job not found</h2>
      <Link to="/jobs" className="mt-4 text-blue-600 hover:underline">Back to jobs</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-4xl"
      >
        <Link to="/jobs" className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Jobs
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
          {/* Header */}
          <div className="relative bg-gray-900 px-8 py-10">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="text-white w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" /></svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-blue-200 backdrop-blur-sm mb-4">
                  ID: {job._id}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{job.jobTitle ?? job.title}</h1>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/matches/${jobId}`}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition-all"
                >
                  Find Matches
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">Description</h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {job.jobDescription ?? job.description}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl bg-gray-50 p-6 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">At a Glance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Posted recently
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Remote
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetail;