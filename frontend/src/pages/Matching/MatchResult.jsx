import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { analyzeResume, deleteMatch, getMatchesByJob, rankResumesForJob } from "../../api/match.api";

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

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Analyze Single Resume</h2>
            <p className="mt-1 text-xs text-gray-500">Analyze one resume against this jobId.</p>
            <form onSubmit={handleAnalyze} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Resume ID</label>
                <input
                  value={resumeIdToAnalyze}
                  onChange={(e) => setResumeIdToAnalyze(e.target.value)}
                  placeholder="Paste resumeId"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Analyze
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;