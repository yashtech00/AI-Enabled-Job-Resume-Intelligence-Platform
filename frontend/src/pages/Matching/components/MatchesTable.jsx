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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Candidates</h2>
          <p className="mt-1 text-sm text-gray-500">Comprehensive list of all matches.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Min Match %</label>
          <input
            type="number"
            value={minMatch}
            onChange={(e) => onMinMatchChange(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white"
          >
            <option value="rankScore">Rank Score</option>
            <option value="matchPercentage">Match %</option>
            <option value="createdAt">Date Created</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Page</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span className="text-sm font-medium w-8 text-center">{page}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Results/Page</label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Match Analysis</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Key Skills</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(Array.isArray(matches) ? matches : []).map((m) => (
                <tr key={m._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {m?.resumeId?.candidateName?.[0] || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{m?.resumeId?.candidateName || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{m?.resumeId?.email || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">Match Score</span>
                        <span className="font-bold text-blue-600">{m.matchPercentage}%</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${m.matchPercentage}%` }}></div>
                      </div>
                      <div className="mt-1 text-[10px] text-gray-400 flex gap-2">
                        <span>Rank: {m.rankScore}</span>
                        <span>•</span>
                        <span>Exp: {m.experienceScore}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(m.matchedSkills || []).slice(0, 4).map((s) => (
                        <span key={s} className="rounded px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {s}
                        </span>
                      ))}
                      {(m.matchedSkills || []).length > 4 && (
                        <span className="rounded px-2 py-0.5 text-[10px] font-medium bg-gray-50 text-gray-400 border border-gray-100">
                          +{(m.matchedSkills || []).length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/chat/${m?.resumeId?._id}`}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => onDownload(m?.resumeId?._id)}
                        disabled={downloadingId === m?.resumeId?._id}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      </button>
                      <button
                        onClick={() => onDeleteMatch(m._id)}
                        className="rounded-lg border border-transparent bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && (Array.isArray(matches) ? matches : []).length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={4}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <p className="font-medium text-gray-900">No matches found</p>
                      <p className="mt-1">Try adjusting your filters or rank resumes again.</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-2">
          <div>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.totalMatches)} of {pagination.totalMatches} results</div>
          {loading && <div className="text-blue-600 font-medium animate-pulse">Updating...</div>}
        </div>
      )}
    </div>
  );
};

export default MatchesTable;
