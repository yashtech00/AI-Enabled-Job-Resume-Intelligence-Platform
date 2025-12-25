import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  clearConversation,
  deleteConversation,
  getConversation,
  getUserConversations,
  quickAsk,
  sendMessage,
  startConversation,
} from "../../api/chat.api";

const ResumeChat = () => {
  const { resumeId } = useParams();
  const userId = useMemo(() => {
    return localStorage.getItem("userId") || "demo-user";
  }, []);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [candidateName, setCandidateName] = useState("Resume");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const [userConversations, setUserConversations] = useState([]);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [quickAnswer, setQuickAnswer] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refreshUserConversations = async () => {
    const data = await getUserConversations(userId);
    const conversations = data?.data?.conversations || [];
    setUserConversations(conversations);
  };

  const loadConversation = async (convId) => {
    if (!convId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getConversation(convId);
      const conv = data?.data;
      setConversationId(conv?.conversationId || convId);
      setCandidateName(conv?.candidate?.name || "Resume");
      setMessages(conv?.messages || []);
    } catch (e) {
      setError("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const ensureConversation = async () => {
    if (!resumeId) {
      setError("Missing resumeId in route");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await startConversation({ resumeId, userId });
      const convId = data?.data?.conversationId;
      if (!convId) {
        setError(data?.message || "Failed to start conversation");
        return;
      }
      setConversationId(convId);
      setCandidateName(data?.data?.candidateName || "Resume");
      await loadConversation(convId);
      await refreshUserConversations();
    } catch (e) {
      setError("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ensureConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  useEffect(() => {
    refreshUserConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, sending]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!conversationId) return;
    if (!input.trim()) return;

    if (sending) return;
    setError(null);
    setSending(true);

    const userMsg = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const contentToSend = input;
    setInput("");

    try {
      const data = await sendMessage({ conversationId, message: contentToSend });
      const aiResponse = data?.data?.aiResponse;
      if (!aiResponse) {
        setError(data?.message || "Failed to send message");
        return;
      }

      const assistantMsg = { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, assistantMsg]);
      await refreshUserConversations();
    } catch (e2) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!conversationId) return;
    setError(null);
    setLoading(true);
    try {
      const data = await clearConversation(conversationId);
      if (data?.success === false) {
        setError(data?.message || "Failed to clear conversation");
        return;
      }
      setMessages([]);
      await refreshUserConversations();
    } catch (e) {
      setError("Failed to clear conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    const current = conversationId;
    setError(null);
    setLoading(true);
    try {
      const data = await deleteConversation(current);
      if (data?.success === false) {
        setError(data?.message || "Failed to delete conversation");
        return;
      }
      setConversationId(null);
      setMessages([]);
      await refreshUserConversations();
      await ensureConversation();
    } catch (e) {
      setError("Failed to delete conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAsk = async (e) => {
    e?.preventDefault?.();
    setQuickAnswer(null);
    setError(null);

    if (!resumeId) return;
    if (!quickQuestion.trim()) return;

    setQuickLoading(true);
    try {
      const data = await quickAsk({ resumeId, question: quickQuestion });
      const answer = data?.data?.answer;
      if (!answer) {
        setError(data?.message || "Failed to get quick answer");
        return;
      }
      setQuickAnswer(answer);
    } catch (e2) {
      setError("Failed to get quick answer");
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
          <div>
            <h2 className="m-0 text-base font-semibold text-gray-900">Conversations</h2>
            <div className="mt-0.5 text-xs text-gray-500">User: {userId}</div>
          </div>
          <button
            onClick={refreshUserConversations}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-3">
          <div className="flex flex-col gap-2">
            {userConversations.map((c) => (
              <button
                key={c.conversationId}
                onClick={() => loadConversation(c.conversationId)}
                className={
                  "rounded-xl border p-3 text-left transition " +
                  (c.conversationId === conversationId
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
                    {c.messageCount}
                  </div>
                </div>
              </button>
            ))}
            {userConversations.length === 0 ? <div className="p-2 text-xs text-gray-500">No conversations</div> : null}
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="text-xs font-semibold text-gray-900">Quick Ask</div>
            <div className="mt-1 text-[11px] text-gray-500">Ask without saving to the conversation.</div>
            <form onSubmit={handleQuickAsk} className="mt-3 flex flex-col gap-2">
              <input
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Ask a quick question..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={quickLoading}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quickLoading ? "Asking..." : "Ask"}
              </button>
            </form>
            {quickAnswer ? (
              <div className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800">
                {quickAnswer}
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="m-0 truncate text-lg font-semibold text-gray-900">Chat with {candidateName}</h1>
              <div className="mt-0.5 text-xs text-gray-500">Resume: {resumeId} • Conversation: {conversationId || "-"}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                disabled={!conversationId || loading}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
              <button
                onClick={handleDelete}
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

        <div className="h-[520px] overflow-auto bg-gray-50 p-4">
          {loading ? <div className="mb-3 text-sm text-gray-500">Loading...</div> : null}

          {messages.length === 0 && !loading ? (
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="text-sm font-semibold text-gray-900">Start the conversation</div>
              <div className="mt-1 text-xs text-gray-500">Ask anything about this resume and I’ll respond using the resume context.</div>
            </div>
          ) : null}

          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div
                key={`${m.timestamp || idx}-${idx}`}
                className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className={"max-w-[85%] sm:max-w-[75%]"}>
                  <div
                    className={
                      "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-sm " +
                      (m.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 border border-gray-200")
                    }
                  >
                    {m.content}
                  </div>
                  <div
                    className={
                      "mt-1 text-[11px] text-gray-400 " +
                      (m.role === "user" ? "text-right" : "text-left")
                    }
                  >
                    {m.role === "user" ? "You" : "Assistant"}
                  </div>
                </div>
              </div>
            ))}

            {sending ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                    Thinking...
                  </div>
                  <div className="mt-1 text-[11px] text-gray-400">Assistant</div>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask about the resume… (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={!conversationId || sending || loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
          <div className="mt-2 text-[11px] text-gray-500">Tip: Use Shift+Enter to add a new line.</div>
        </div>
      </section>
    </div>
  );
};

export default ResumeChat;