import React from "react";
import { Link } from "react-router-dom";
import ScoreBar from "./ScoreBar";
import { motion } from "framer-motion";

const TopCandidatesGrid = ({
  rankedCandidates,
  rankSummary,
  expandedSkills,
  onToggleExpanded,
  onClear,
  onDownload,
  downloadingId,
}) => {
  if (!Array.isArray(rankedCandidates) || rankedCandidates.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Top Recommendations
          </div>
          <h2 className="text-xl font-bold text-gray-900">Best Matches Found</h2>
          <p className="mt-1 text-sm text-gray-500">
            {rankSummary?.jobTitle ? `${rankSummary.jobTitle} • ` : null}
            Showing {rankedCandidates.length} potential candidates
          </p>
        </div>
        <button
          onClick={onClear}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Dismiss Recommendations
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rankedCandidates.map((c, index) => {
          const resumeId = c?.resumeId;
          const isExpanded = !!expandedSkills?.[resumeId];
          const matched = Array.isArray(c?.matchedSkills) ? c.matchedSkills : [];
          const missing = Array.isArray(c?.missingSkills) ? c.missingSkills : [];

          const matchedPreview = isExpanded ? matched : matched.slice(0, 12);
          const missingPreview = isExpanded ? missing : missing.slice(0, 10);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={resumeId}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-gray-300">#{c?.rank ?? "-"}</div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 truncate pr-6">{c?.candidateName || "Candidate"}</h3>
                <div className="flex flex-col text-xs text-gray-500 mt-1 space-y-1">
                  {c?.email && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {c.email}</span>}
                  {c?.phone && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {c.phone}</span>}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <ScoreBar value={c?.matchPercentage} label="Overall Match" colorClass="bg-green-500" />
                <div className="grid grid-cols-2 gap-3">
                  <ScoreBar value={c?.semanticScore} label="Semantic" colorClass="bg-blue-500" hClass="h-1.5" />
                  <ScoreBar value={c?.experienceScore} label="Experience" colorClass="bg-violet-500" hClass="h-1.5" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Skills Match</span>
                  {matched.length > 12 && (
                    <button onClick={() => onToggleExpanded(resumeId)} className="text-[10px] text-blue-600 font-semibold hover:underline">
                      {isExpanded ? "Less" : "View All"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {matchedPreview.map((s) => (
                    <span key={s} className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-50 mt-auto">
                <Link to={`/chat/${resumeId}`} className="flex-1">
                  <button className="w-full rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors">
                    Chat
                  </button>
                </Link>
                <button
                  onClick={() => onDownload(resumeId)}
                  disabled={downloadingId === resumeId}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {downloadingId === resumeId ? "..." : "Download"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCandidatesGrid;
