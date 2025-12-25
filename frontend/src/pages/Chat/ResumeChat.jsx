import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  clearConversation,
  deleteConversation,
  getConversation,
  getUserConversations,
  sendMessage,
  startConversation,
} from "../../api/chat.api";

import ChatHeader from "./components/ChatHeader";
import ConversationSidebar from "./components/ConversationSidebar";
import MessageComposer from "./components/MessageComposer";
import MessageList from "./components/MessageList";

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

  const refreshUserConversations = useCallback(async () => {
    try {
      const data = await getUserConversations(userId);
      const conversations = data?.data?.conversations || [];
      setUserConversations(conversations);
    } catch (e) {
      // keep silent; the header error handles primary UX
    }
  }, [userId]);

  const loadConversation = useCallback(async (convId) => {
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
  }, []);

  const ensureConversation = useCallback(async () => {
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
  }, [loadConversation, refreshUserConversations, resumeId, userId]);

  useEffect(() => {
    ensureConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  useEffect(() => {
    refreshUserConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = useCallback(async () => {
    if (!conversationId) return;
    if (!input.trim()) return;
    if (sending) return;

    setError(null);
    setSending(true);

    const contentToSend = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: contentToSend, timestamp: new Date().toISOString() }]);

    try {
      const data = await sendMessage({ conversationId, message: contentToSend });
      const aiResponse = data?.data?.aiResponse;
      if (!aiResponse) {
        setError(data?.message || "Failed to send message");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() }]);
      await refreshUserConversations();
    } catch (e2) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  }, [conversationId, input, refreshUserConversations, sending]);

  const handleClear = useCallback(async () => {
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
  }, [conversationId, refreshUserConversations]);

  const handleDelete = useCallback(async () => {
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
  }, [conversationId, ensureConversation, refreshUserConversations]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
      <ConversationSidebar
        userId={userId}
        conversations={userConversations}
        selectedConversationId={conversationId}
        onRefresh={refreshUserConversations}
        onSelectConversation={loadConversation}
        loading={loading}
      />

      <section className="rounded-xl border border-gray-200 bg-white">
        <ChatHeader
          candidateName={candidateName}
          resumeId={resumeId}
          conversationId={conversationId}
          onClear={handleClear}
          onDelete={handleDelete}
          loading={loading}
          error={error}
        />

        <MessageList messages={messages} loading={loading} sending={sending} />

        <MessageComposer
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={!conversationId}
          sending={sending}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default ResumeChat;