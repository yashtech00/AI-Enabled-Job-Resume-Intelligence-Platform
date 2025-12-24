// src/routes/chatRoutes.js
import express from "express";
import {
    startConversation,
    sendMessage,
    getConversation,
    deleteConversation,
    getUserConversations,
    clearConversation,
    quickAsk
} from "../controller/chat.controller.js";

const chatRouter = express.Router();

// Core conversation routes
chatRouter.post('/start-conversation', startConversation);
chatRouter.post('/send-message', sendMessage);
chatRouter.get('/get-conversation/:conversationId', getConversation);
chatRouter.delete('/delete-conversation/:conversationId', deleteConversation);

// Additional utility routes
chatRouter.get('/conversations/user/:userId', getUserConversations);
chatRouter.post('/clear/:conversationId', clearConversation);
chatRouter.post('/quick-ask', quickAsk);

export default chatRouter;
