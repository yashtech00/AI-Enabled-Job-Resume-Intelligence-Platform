import React from "react";

const ChatHeader = ({ candidateName, resumeId, conversationId, onClear, onDelete, loading, error }) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 p-4 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="m-0 truncate text-lg font-semibold text-gray-900">Chat with {candidateName}</h1>
          <div className="mt-0.5 text-xs text-gray-500">Resume: {resumeId} • Conversation: {conversationId || "-"}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            disabled={!conversationId || loading}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={onDelete}
            disabled={!conversationId || loading}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      ) : null}
    </div>
  );
};

export default ChatHeader;
