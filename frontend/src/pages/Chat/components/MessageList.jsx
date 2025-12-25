import React, { useEffect, useRef } from "react";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}
    >
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div
          className={
            "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-sm " +
            (isUser ? "bg-gray-900 text-white" : "bg-white text-gray-900 border border-gray-200")
          }
        >
          {content}
        </div>
        <div className={"mt-1 text-[11px] text-gray-400 " + (isUser ? "text-right" : "text-left")}>
          {isUser ? "You" : "Assistant"}
        </div>
      </div>
    </div>
  );
};

const MessageList = ({ messages, loading, sending }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, sending]);

  const normalizedMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="h-[520px] overflow-auto bg-gray-50 p-4">
      {loading ? <div className="mb-3 text-sm text-gray-500">Loading...</div> : null}

      {normalizedMessages.length === 0 && !loading ? (
        <div className="mx-auto mt-10 max-w-md rounded-xl border border-gray-200 bg-white p-5 text-center">
          <div className="text-sm font-semibold text-gray-900">Start the conversation</div>
          <div className="mt-1 text-xs text-gray-500">Ask anything about this resume and I’ll respond using the resume context.</div>
        </div>
      ) : null}

      <div className="space-y-3">
        {normalizedMessages.map((m, idx) => (
          <MessageBubble key={`${m.timestamp || idx}-${idx}`} role={m.role} content={m.content} />
        ))}

        {sending ? (
          <MessageBubble role="assistant" content="Thinking..." />
        ) : null}

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default MessageList;
