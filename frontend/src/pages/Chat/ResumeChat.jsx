import React, { useEffect, useMemo, useState } from "react";
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

  const [userConversations, setUserConversations] = useState([]);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [quickAnswer, setQuickAnswer] = useState(null);

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

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!conversationId) return;
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const contentToSend = input;
    setInput("");

    const data = await sendMessage({ conversationId, message: contentToSend });
    const aiResponse = data?.data?.aiResponse;
    if (!aiResponse) {
      setError(data?.message || "Failed to send message");
      return;
    }

    const assistantMsg = { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, assistantMsg]);
    await refreshUserConversations();
  };

  const handleClear = async () => {
    if (!conversationId) return;
    const data = await clearConversation(conversationId);
    if (data?.success === false) {
      setError(data?.message || "Failed to clear conversation");
      return;
    }
    setMessages([]);
    await refreshUserConversations();
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    const current = conversationId;
    const data = await deleteConversation(current);
    if (data?.success === false) {
      setError(data?.message || "Failed to delete conversation");
      return;
    }
    setConversationId(null);
    setMessages([]);
    await refreshUserConversations();
    await ensureConversation();
  };

  const handleQuickAsk = async (e) => {
    e?.preventDefault?.();
    setQuickAnswer(null);
    setError(null);

    if (!resumeId) return;
    if (!quickQuestion.trim()) return;

    const data = await quickAsk({ resumeId, question: quickQuestion });
    const answer = data?.data?.answer;
    if (!answer) {
      setError(data?.message || "Failed to get quick answer");
      return;
    }
    setQuickAnswer(answer);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      <div className="border-b border-gray-200 pb-4 lg:border-b-0 lg:border-r lg:pr-4">
        <h2 className="mt-0 text-lg font-semibold">Conversations</h2>
        <div className="mb-3 text-xs text-gray-500">User: {userId}</div>
        <button
          onClick={refreshUserConversations}
          className="mb-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
        <div className="flex flex-col gap-2">
          {userConversations.map((c) => (
            <button
              key={c.conversationId}
              onClick={() => loadConversation(c.conversationId)}
              className={
                "rounded-lg border border-gray-200 p-3 text-left transition hover:bg-gray-50 " +
                (c.conversationId === conversationId ? "bg-gray-100" : "bg-white")
              }
            >
              <div className="font-semibold">{c.candidateName || "Resume"}</div>
              <div className="text-xs text-gray-500">
                {c.lastMessage || "No messages yet"}
              </div>
              <div className="mt-1 text-[11px] text-gray-400">
                Messages: {c.messageCount}
              </div>
            </button>
          ))}
          {userConversations.length === 0 ? (
            <div className="text-xs text-gray-500">No conversations</div>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-xl font-semibold">Chat with {candidateName}</h1>
            <div className="text-xs text-gray-500">
              Resume: {resumeId} | Conversation: {conversationId || "-"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              disabled={!conversationId}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
            <button
              onClick={handleDelete}
              disabled={!conversationId}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-4 h-[420px] overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
          {loading ? <div className="text-sm text-gray-500">Loading...</div> : null}
          {messages.map((m, idx) => (
            <div
              key={`${m.timestamp || idx}-${idx}`}
              className={"mb-2.5 flex " + (m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={
                  "max-w-[75%] whitespace-pre-wrap rounded-xl border border-gray-200 px-3 py-2 " +
                  (m.role === "user" ? "bg-blue-100" : "bg-white")
                }
              >
                <div className="mb-1 text-xs font-bold text-gray-800">
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <div>{m.content}</div>
              </div>
            </div>
          ))}
          {messages.length === 0 && !loading ? (
            <div className="text-sm text-gray-500">No messages yet. Ask something about this resume.</div>
          ) : null}
        </div>

        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={!conversationId}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>

        <div className="mt-5 border-t border-gray-200 pt-3">
          <h3 className="mt-0 text-base font-semibold">Quick Ask (no saved conversation)</h3>
          <form onSubmit={handleQuickAsk} className="flex gap-2">
            <input
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              placeholder="Ask a quick question..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Ask
            </button>
          </form>
          {quickAnswer ? (
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
              {quickAnswer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ResumeChat;