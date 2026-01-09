import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteMatch, getMatchesByJob, rankResumesForJob } from "../../api/match.api";
import { downloadResume } from "../../api/resume.api";
import { motion } from "framer-motion";

import MatchesTable from "./components/MatchesTable";
import RankPanel from "./components/RankPanel";
import TopCandidatesGrid from "./components/TopCandidatesGrid";

export const MatchResult = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [matches, setMatches] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState("rankScore");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [rankLimit, setRankLimit] = useState(10);

  const [rankSummary, setRankSummary] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);

  const toggleExpanded = useCallback((resumeId) => {
    setExpandedSkills((prev) => ({ ...prev, [resumeId]: !prev[resumeId] }));
  }, []);

  const handleDownload = useCallback(async (resumeId) => {
    if (!resumeId) return;
    setDownloadingId(resumeId);
    setError(null);
    try {
      const result = await downloadResume(resumeId);

      if (result?.success === false) {
        setError(result?.message || "Failed to download resume");
        return;
      }
      const blob = result?.data?.blob;
      const filename = result?.data?.filename || `resume-${resumeId}.pdf`;
      if (!blob) {
        setError("Failed to download resume");
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError("Failed to download resume");
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const queryParams = useMemo(() => {
    return { page, limit, minMatch, sortBy };
  }, [page, limit, minMatch, sortBy]);

  const fetchMatches = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMatchesByJob(jobId, queryParams);

      const list = data?.data?.matches || [];
      setMatches(list);
      setPagination(data?.data?.pagination || null);
    } catch (e) {
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, [jobId, queryParams]);

  useEffect(() => {
    fetchMatches();
  }, [jobId, queryParams]); // eslint-disable-line

  const handleRank = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await rankResumesForJob({ jobId, limit: Number(rankLimit) || 10 });

      if (data?.success === false) {
        setError(data?.message || "Failed to rank resumes");
        return;
      }
      const payload = data?.data || null;
      const top = payload?.topCandidates || [];
      setRankSummary({
        jobId: payload?.jobId || jobId,
        jobTitle: payload?.jobTitle,
        totalCandidates: payload?.totalCandidates,
      });
      setRankedCandidates(Array.isArray(top) ? top : []);
      await fetchMatches();
    } catch (e) {
      setError("Failed to rank resumes");
    } finally {
      setLoading(false);
    }
  }, [fetchMatches, jobId, rankLimit]);

  const handleDelete = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deleteMatch(id);

      if (data?.success === false) {
        setError(data?.message || "Failed to delete match");
        return;
      }
      await fetchMatches();
    } catch (e) {
      setError("Failed to delete match");
    } finally {
      setLoading(false);
    }
  }, [fetchMatches]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto w-full max-w-7xl"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/jobs" className="mb-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Match <span className="text-blue-600">Results</span></h1>
            <p className="mt-2 text-gray-600">AI-powered analysis for Job ID: {jobId}</p>
          </div>

          <button
            onClick={fetchMatches}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top Ranked Candidates (if available) */}
            {rankedCandidates.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TopCandidatesGrid
                  rankedCandidates={rankedCandidates}
                  rankSummary={rankSummary}
                  expandedSkills={expandedSkills}
                  onToggleExpanded={toggleExpanded}
                  onClear={() => setRankedCandidates([])}
                  onDownload={handleDownload}
                  downloadingId={downloadingId}
                />
              </motion.section>
            )}

            {/* All Matches Table */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MatchesTable
                matches={matches}
                loading={loading}
                pagination={pagination}
                onRefresh={fetchMatches}
                minMatch={minMatch}
                sortBy={sortBy}
                page={page}
                limit={limit}
                onMinMatchChange={setMinMatch}
                onSortByChange={setSortBy}
                onPageChange={setPage}
                onLimitChange={setLimit}
                onDeleteMatch={handleDelete}
                onDownload={handleDownload}
                downloadingId={downloadingId}
              />
            </motion.section>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RankPanel
                rankLimit={rankLimit}
                onRankLimitChange={setRankLimit}
                onRank={handleRank}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MatchResult;