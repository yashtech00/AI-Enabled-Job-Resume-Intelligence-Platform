import React from "react";

const RankPanel = ({ rankLimit, onRankLimitChange, onRank, loading }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Rank Resumes</h2>
            <p className="text-xs text-gray-500">AI-powered ranking</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Top Candidates Limit</label>
            <input
              type="number"
              value={rankLimit}
              onChange={(e) => onRankLimitChange(Number(e.target.value) || 10)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 focus:bg-white"
              placeholder="e.g. 10"
            />
            <p className="mt-2 text-[10px] text-gray-400">Limit the number of candidates to process for ranking.</p>
          </div>

          <button
            onClick={onRank}
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-black hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? "Processing..." : "Generate Rankings"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
        <p className="text-sm text-blue-100 leading-relaxed">
          Use the ranking tool to re-evaluate candidates against updated job descriptions for better accuracy.
        </p>
      </div>
    </div>
  );
};

export default RankPanel;
