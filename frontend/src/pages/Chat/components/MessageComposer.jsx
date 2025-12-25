import React from "react";

const MessageComposer = ({ value, onChange, onSend, disabled, sending, loading }) => {
  return (
    <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex gap-3"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask about the resume… (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={disabled || sending || loading || !value.trim()}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
      <div className="mt-2 text-[11px] text-gray-500">Tip: Use Shift+Enter to add a new line.</div>
    </div>
  );
};

export default MessageComposer;
