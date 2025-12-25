import React from "react";

const ConversationSidebar = ({
  userId,
  conversations,
  selectedConversationId,
  onRefresh,
  onSelectConversation,
  loading,
}) => {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
        <div>
          <h2 className="m-0 text-base font-semibold text-gray-900">Conversations</h2>
          <div className="mt-0.5 text-xs text-gray-500">User: {userId}</div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="max-h-[70vh] overflow-auto p-3">
        <div className="flex flex-col gap-2">
          {(Array.isArray(conversations) ? conversations : []).map((c) => (
            <button
              key={c.conversationId}
              onClick={() => onSelectConversation(c.conversationId)}
              className={
                "rounded-xl border p-3 text-left transition " +
                (c.conversationId === selectedConversationId
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-white hover:bg-gray-50")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-gray-900">{c.candidateName || "Resume"}</div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-gray-500">{c.lastMessage || "No messages yet"}</div>
                </div>
                <div className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700">
                  {c.messageCount || 0}
                </div>
              </div>
            </button>
          ))}
          {(Array.isArray(conversations) ? conversations : []).length === 0 ? (
            <div className="p-2 text-xs text-gray-500">No conversations</div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default ConversationSidebar;
