import React from "react";

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

export default ScoreBar;
