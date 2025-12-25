import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { analyzeResume, deleteMatch, getMatchesByJob, rankResumesForJob } from "../../api/match.api";
import { downloadResume } from "../../api/resume.api";

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
  const [resumeIdToAnalyze, setResumeIdToAnalyze] = useState("");

  const [rankSummary, setRankSummary] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);

  const toggleExpanded = (resumeId) => {
    setExpandedSkills((prev) => ({ ...prev, [resumeId]: !prev[resumeId] }));
  };

  const handleDownload = async (resumeId) => {
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
  };

  const ScoreBar = ({ value, label, colorClass }) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    return (
      <div>
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <div>{label}</div>
          <div className="font-medium text-gray-700">{v.toFixed(0)}%</div>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
          <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    );
  };

  const queryParams = useMemo(() => {
    return { page, limit, minMatch, sortBy };
  }, [page, limit, minMatch, sortBy]);

  const fetchMatches = async () => {
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
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, queryParams]);

  const handleRank = async () => {
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
  };

  const handleAnalyze = async (e) => {
    e?.preventDefault?.();
    if (!jobId) return;
    if (!resumeIdToAnalyze.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume({ resumeId: resumeIdToAnalyze.trim(), jobId });
      if (data?.success === false) {
        setError(data?.message || "Failed to analyze resume");
        return;
      }
      setResumeIdToAnalyze("");
      await fetchMatches();
    } catch (e2) {
      setError("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
  };

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
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Top Candidates</h2>
              <p className="mt-1 text-xs text-gray-500">
                {rankSummary?.jobTitle ? `${rankSummary.jobTitle} • ` : null}
                Showing top {rankedCandidates.length}
                {typeof rankSummary?.totalCandidates === "number" ? ` out of ${rankSummary.totalCandidates}` : null}
              </p>
            </div>
            <button
              onClick={() => setRankedCandidates([])}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rankedCandidates.map((c) => {
              const resumeId = c?.resumeId;
              const isExpanded = !!expandedSkills[resumeId];
              const matched = Array.isArray(c?.matchedSkills) ? c.matchedSkills : [];
              const missing = Array.isArray(c?.missingSkills) ? c.missingSkills : [];

              const matchedPreview = isExpanded ? matched : matched.slice(0, 12);
              const missingPreview = isExpanded ? missing : missing.slice(0, 10);

              return (
                <div key={resumeId} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white">
                          #{c?.rank ?? "-"}
                        </div>
                        <div className="truncate text-sm font-semibold text-gray-900">{c?.candidateName || "-"}</div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {c?.email ? c.email : null}
                        {c?.email && c?.phone ? " • " : null}
                        {c?.phone ? c.phone : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        to={resumeId ? `/chat/${resumeId}` : "#"}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => handleDownload(resumeId)}
                        disabled={downloadingId === resumeId}
                        className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === resumeId ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ScoreBar value={c?.matchPercentage} label="Match" colorClass="bg-green-600" />
                    <ScoreBar value={c?.semanticScore} label="Semantic" colorClass="bg-blue-600" />
                    <ScoreBar value={c?.experienceScore} label="Experience" colorClass="bg-violet-600" />
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Matched Skills</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {matchedPreview.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                          >
                            {s}
                          </span>
                        ))}
                        {matched.length === 0 ? <div className="text-xs text-gray-400">-</div> : null}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Missing Skills</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {missingPreview.map((s) => (
                          <span key={s} className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {s}
                          </span>
                        ))}
                        {missing.length === 0 ? <div className="text-xs text-gray-400">-</div> : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Rank Score: <span className="font-semibold text-gray-900">{c?.rankScore ?? 0}</span>
                    </div>
                    {(matched.length > 12 || missing.length > 10) ? (
                      <button
                        onClick={() => toggleExpanded(resumeId)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                  {c?.experience?.details ? (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">Experience</div>
                      <div className="mt-1">{c.experience.details}</div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Candidates</h2>
              <p className="mt-1 text-xs text-gray-500">Filtered list of matches for this job.</p>
            </div>
            <button
              onClick={fetchMatches}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Min Match %</label>
              <input
                type="number"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="rankScore">Rank Score</option>
                <option value="matchPercentage">Match %</option>
                <option value="createdAt">Created</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Page</label>
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Math.max(1, Number(e.target.value) || 10))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Candidate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Scores
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Skills
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {matches.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {m?.resumeId?.candidateName || "-"}
                        </div>
                        <div className="text-xs text-gray-500">{m?.resumeId?.email || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">Rank: {m.rankScore}</div>
                        <div className="text-xs text-gray-500">Match: {m.matchPercentage}%</div>
                        <div className="mt-1 text-[11px] text-gray-400">Semantic: {m.semanticScore ?? 0} • Exp: {m.experienceScore ?? 0}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(m.matchedSkills || []).slice(0, 6).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                            >
                              {s}
                            </span>
                          ))}
                          {(m.matchedSkills || []).length > 6 ? (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                              +{(m.matchedSkills || []).length - 6}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/chat/${m?.resumeId?._id}`}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Chat
                          </Link>
                          <button
                            onClick={() => handleDownload(m?.resumeId?._id)}
                            disabled={downloadingId === m?.resumeId?._id}
                            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {downloadingId === m?.resumeId?._id ? "Downloading..." : "Download"}
                          </button>
                          <button
                            onClick={() => handleDelete(m._id)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && matches.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-sm text-gray-500" colSpan={4}>
                        No matches found. Try ranking resumes.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div>
              {pagination
                ? `Page ${pagination.currentPage} of ${pagination.totalPages} • Total: ${pagination.totalMatches}`
                : null}
            </div>
            {loading ? <div>Working...</div> : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Rank Resumes</h2>
            <p className="mt-1 text-xs text-gray-500">Generate/refresh ranked matches for this job.</p>
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-700">Top N</label>
              <input
                type="number"
                value={rankLimit}
                onChange={(e) => setRankLimit(Number(e.target.value) || 10)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              onClick={handleRank}
              disabled={loading}
              className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rank Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;