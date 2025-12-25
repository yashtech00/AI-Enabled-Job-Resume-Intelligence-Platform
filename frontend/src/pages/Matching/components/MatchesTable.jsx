import React from "react";
import { Link } from "react-router-dom";

const MatchesTable = ({
  matches,
  loading,
  pagination,
  onRefresh,
  minMatch,
  sortBy,
  page,
  limit,
  onMinMatchChange,
  onSortByChange,
  onPageChange,
  onLimitChange,
  onDeleteMatch,
  onDownload,
  downloadingId,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Candidates</h2>
          <p className="mt-1 text-xs text-gray-500">Filtered list of matches for this job.</p>
        </div>
        <button
          onClick={onRefresh}
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
            onChange={(e) => onMinMatchChange(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
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
            onChange={(e) => onPageChange(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Limit</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => onLimitChange(Math.max(1, Number(e.target.value) || 10))}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Candidate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Scores</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Skills</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {(Array.isArray(matches) ? matches : []).map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{m?.resumeId?.candidateName || "-"}</div>
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
                        <span key={s} className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
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
                        onClick={() => onDownload(m?.resumeId?._id)}
                        disabled={downloadingId === m?.resumeId?._id}
                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === m?.resumeId?._id ? "Downloading..." : "Download"}
                      </button>
                      <button
                        onClick={() => onDeleteMatch(m._id)}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && (Array.isArray(matches) ? matches : []).length === 0 ? (
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
          {pagination ? `Page ${pagination.currentPage} of ${pagination.totalPages} • Total: ${pagination.totalMatches}` : null}
        </div>
        {loading ? <div>Working...</div> : null}
      </div>
    </div>
  );
};

export default MatchesTable;
