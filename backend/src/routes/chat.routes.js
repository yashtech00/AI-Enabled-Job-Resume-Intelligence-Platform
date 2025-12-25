import express from "express";
import {
    startConversation,
    sendMessage,
    getConversation,
    deleteConversation,
    getUserConversations,
    clearConversation,
 
} from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post('/start-conversation', startConversation);
chatRouter.post('/send-message', sendMessage);
chatRouter.get('/get-conversation/:conversationId', getConversation);
chatRouter.delete('/delete-conversation/:conversationId', deleteConversation);
chatRouter.get('/conversations/user/:userId', getUserConversations);
chatRouter.post('/clear/:conversationId', clearConversation);


export default chatRouter;
