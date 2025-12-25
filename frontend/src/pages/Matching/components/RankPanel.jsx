import React from "react";

const RankPanel = ({ rankLimit, onRankLimitChange, onRank, loading }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Rank Resumes</h2>
        <p className="mt-1 text-xs text-gray-500">Generate/refresh ranked matches for this job.</p>
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-700">Top N</label>
          <input
            type="number"
            value={rankLimit}
            onChange={(e) => onRankLimitChange(Number(e.target.value) || 10)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          onClick={onRank}
          disabled={loading}
          className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Rank Now
        </button>
      </div>
    </div>
  );
};

export default RankPanel;
