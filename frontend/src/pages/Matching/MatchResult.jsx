import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteMatch, getMatchesByJob, rankResumesForJob } from "../../api/match.api";
import { downloadResume } from "../../api/resume.api";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, queryParams]);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Match Results</h1>
          <p className="mt-1 text-sm text-gray-500">Job: {jobId || "-"}</p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Jobs
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      ) : null}

      {rankedCandidates.length > 0 ? (
        <TopCandidatesGrid
          rankedCandidates={rankedCandidates}
          rankSummary={rankSummary}
          expandedSkills={expandedSkills}
          onToggleExpanded={toggleExpanded}
          onClear={() => setRankedCandidates([])}
          onDownload={handleDownload}
          downloadingId={downloadingId}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

        <RankPanel
          rankLimit={rankLimit}
          onRankLimitChange={setRankLimit}
          onRank={handleRank}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MatchResult;