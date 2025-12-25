import React from "react";
import { Link } from "react-router-dom";
import ScoreBar from "./ScoreBar";

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
          onClick={onClear}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rankedCandidates.map((c) => {
          const resumeId = c?.resumeId;
          const isExpanded = !!expandedSkills?.[resumeId];
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
                    onClick={() => onDownload(resumeId)}
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
                      <span key={s} className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
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
                {matched.length > 12 || missing.length > 10 ? (
                  <button
                    onClick={() => onToggleExpanded(resumeId)}
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
  );
};

export default TopCandidatesGrid;
