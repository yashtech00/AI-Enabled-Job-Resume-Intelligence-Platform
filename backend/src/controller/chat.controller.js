// src/controllers/chatController.js

import ResumeModel from "../models/Resume.model.js";
import ConversationModel from "../models/Chat.model.js";
import { performRAG, splitTextIntoChunks, createVectorStore, similaritySearch } from "../services/ai/rag.service.js";
import { formatConversationHistory, buildMemoryContext, extractTopics } from "../services/ai/memory.service.js";
import { chatLLM, embeddings } from "../config/langchain.js";


/**
 * @route   POST /api/chat/start-conversation
 * @desc    Start a new conversation with a resume
 * @body    { resumeId, userId }
 */
export const startConversation = async (req, res) => {
    try {
        const { resumeId, userId = 'demo-user' } = req.body;

        // Validation
        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "resumeId is required"
            });
        }

        // Check if resume exists
        const resume = await ResumeModel.findById(resumeId);
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Check if active conversation already exists
        const existingConversation = await ConversationModel.findOne({
            resumeId,
            userId,
            isActive: true
        });

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                message: "Active conversation already exists",
                data: {
                    conversationId: existingConversation._id,
                    resumeId: existingConversation.resumeId,
                    candidateName: resume.candidateName,
                    messageCount: existingConversation.messages.length
                }
            });
        }

        // Create new conversation with memory context
        const conversation = await ConversationModel.create({
            resumeId,
            userId,
            messages: [],
            memoryContext: {
                candidateName: resume.candidateName,
                candidateId: resume._id,
                skills: resume.extractedSkills || [],
                totalYears: resume.experience?.totalYears || 0,
                discussedTopics: [],
                messageCount: 0,
                lastUpdated: new Date()
            },
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Conversation started successfully",
            data: {
                conversationId: conversation._id,
                resumeId: conversation.resumeId,
                candidateName: resume.candidateName,
                userId: conversation.userId
            }
        });

    } catch (error) {
        console.error('Start conversation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   POST /api/chat/send-message
 * @desc    Send a message and get AI response using RAG
 * @body    { conversationId, message }
 */
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        // Validation
        if (!conversationId || !message) {
            return res.status(400).json({
                success: false,
                message: "conversationId and message are required"
            });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        // Get conversation with resume
        const conversation = await ConversationModel.findById(conversationId)
            .populate('resumeId');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const resume = conversation.resumeId;
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found for this conversation"
            });
        }

        // ============================================
        // STEP 1: Format conversation history using memoryService
        // ============================================
        const conversationHistory = formatConversationHistory(conversation.messages, 5);

        // ============================================
        // STEP 2: Perform RAG using ragService
        // ============================================
        const context = {
            conversationHistory: conversationHistory,
            candidateName: resume.candidateName,
            totalYears: resume.experience?.totalYears || 0,
            skills: resume.extractedSkills?.join(", ") || "Not specified"
        };

        const aiResponse = await performRAG(
            resume.extractedText,
            message,
            context
        );

        // ============================================
        // STEP 3: Update memory context using memoryService
        // ============================================
        const updatedMemoryContext = buildMemoryContext(
            { ...conversation, messages: [...conversation.messages, { role: 'user', content: message }] },
            resume
        );

        // Add last question and response
        updatedMemoryContext.lastQuestion = message;
        updatedMemoryContext.lastResponse = aiResponse;

        // ============================================
        // STEP 4: Save messages in conversation
        // ============================================
        conversation.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });

        conversation.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        conversation.memoryContext = updatedMemoryContext;
        await conversation.save();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: {
                conversationId: conversation._id,
                userMessage: message,
                aiResponse: aiResponse,
                timestamp: new Date(),
                messageCount: conversation.messages.length
            }
        });

    } catch (error) {
        console.error('Send message error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   GET /api/chat/get-conversation/:conversationId
 * @desc    Get conversation history
 */
export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Validation
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "conversationId is required"
            });
        }

        // Get conversation with resume details
        const conversation = await ConversationModel.findById(conversationId)
            .populate('resumeId', 'candidateName email phone extractedSkills experience');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const resume = conversation.resumeId;

        // Format response
        const formattedConversation = {
            conversationId: conversation._id,
            candidate: {
                id: resume?._id || conversation?.memoryContext?.candidateId,
                name: resume?.candidateName || conversation?.memoryContext?.candidateName,
                email: resume?.email,
                phone: resume?.phone,
                skills: resume?.extractedSkills || conversation?.memoryContext?.skills || [],
                experience: resume?.experience || { totalYears: conversation?.memoryContext?.totalYears || 0 }
            },
            messages: conversation.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
            })),
            memoryContext: conversation.memoryContext,
            isActive: conversation.isActive,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messageCount: conversation.messages.length
        };

        return res.status(200).json({
            success: true,
            data: formattedConversation
        });

    } catch (error) {
        console.error('Get conversation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   DELETE /api/chat/delete-conversation/:conversationId
 * @desc    Delete a conversation
 */
export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Validation
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "conversationId is required"
            });
        }

        // Find and delete conversation
        const conversation = await ConversationModel.findByIdAndDelete(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully",
            data: {
                conversationId: conversation._id,
                messagesDeleted: conversation.messages.length
            }
        });

    } catch (error) {
        console.error('Delete conversation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   GET /api/chat/conversations/user/:userId
 * @desc    Get all conversations for a user
 */
export const getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const conversations = await ConversationModel.find({ userId })
            .populate('resumeId', 'candidateName email')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ConversationModel.countDocuments({ userId });

        const formatted = conversations.map((conv) => {
            const candidateName = conv?.resumeId?.candidateName || conv?.memoryContext?.candidateName;
            const candidateEmail = conv?.resumeId?.email;
            return {
                conversationId: conv._id,
                candidateName,
                candidateEmail,
                messageCount: conv.messages.length,
                lastMessage: conv.messages[conv.messages.length - 1]?.content?.substring(0, 100),
                updatedAt: conv.updatedAt,
                isActive: conv.isActive
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                conversations: formatted,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalConversations: total
                }
            }
        });

    } catch (error) {
        console.error('Get user conversations error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   POST /api/chat/clear/:conversationId
 * @desc    Clear conversation messages but keep session
 */
export const clearConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await ConversationModel.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const messageCount = conversation.messages.length;
        conversation.messages = [];
        conversation.memoryContext = {
            candidateName: conversation.memoryContext.candidateName,
            candidateId: conversation.memoryContext.candidateId,
            skills: conversation.memoryContext.skills,
            totalYears: conversation.memoryContext.totalYears,
            discussedTopics: [],
            messageCount: 0,
            lastUpdated: new Date()
        };

        await conversation.save();

        return res.status(200).json({
            success: true,
            message: "Conversation cleared successfully",
            data: {
                conversationId: conversation._id,
                messagesCleared: messageCount
            }
        });

    } catch (error) {
        console.error('Clear conversation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @route   POST /api/chat/quick-ask
 * @desc    Quick question without creating persistent conversation
 */
export const quickAsk = async (req, res) => {
    try {
        const { resumeId, question } = req.body;

        if (!resumeId || !question) {
            return res.status(400).json({
                success: false,
                message: "resumeId and question are required"
            });
        }

        const resume = await ResumeModel.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Perform RAG without conversation history
        const answer = await performRAG(
            resume.extractedText,
            question,
            {
                candidateName: resume.candidateName,
                totalYears: resume.experience?.totalYears || 0,
                skills: resume.extractedSkills?.join(", ") || "Not specified",
                conversationHistory: "No previous conversation."
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                question: question,
                answer: answer,
                candidateName: resume.candidateName
            }
        });

    } catch (error) {
        console.error('Quick ask error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};