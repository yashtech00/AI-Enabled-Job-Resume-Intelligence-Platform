import { axiosInstance } from "./axiosInstances";

export const startConversation = async (data) => {
    try {
        const response = await axiosInstance.post("/chat/start-conversation", data);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const sendMessage = async (data) => {
    try {
        const response = await axiosInstance.post("/chat/send-message", data);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const getConversation = async (conversationId) => {
    try {
        const response = await axiosInstance.get(`/chat/get-conversation/${conversationId}`);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const deleteConversation = async (conversationId) => {
    try {
        const response = await axiosInstance.delete(`/chat/delete-conversation/${conversationId}`);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const getUserConversations = async (userId) => {
    try {
        const response = await axiosInstance.get(`/chat/conversations/user/${userId}`);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const clearConversation = async (conversationId) => {
    try {
        const response = await axiosInstance.post(`/chat/clear/${conversationId}`);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const quickAsk = async (data) => {
    try {
        const response = await axiosInstance.post("/chat/quick-ask", data);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}