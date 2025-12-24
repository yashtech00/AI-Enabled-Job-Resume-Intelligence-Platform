// src/config/langchain.js
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

// Validate API key
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in environment variables');
    throw new Error('OPENAI_API_KEY is required');
}

/**
 * Initialize OpenAI Chat Model
 */
export const initializeLLM = (options = {}) => {
    return new ChatOpenAI({
        modelName: options.modelName || process.env.OPENAI_MODEL || "gpt-4",
        temperature: options.temperature !== undefined ? options.temperature : 0.3,
        openAIApiKey: process.env.OPENAI_API_KEY,
        maxTokens: options.maxTokens || 1000,
        ...options
    });
};

/**
 * Initialize OpenAI Embeddings
 */
export const initializeEmbeddings = () => {
    return new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
    });
};

/**
 * Default LLM instance
 */
export const llm = initializeLLM();

/**
 * Default Embeddings instance
 */
export const embeddings = initializeEmbeddings();

/**
 * LLM for skill extraction (lower temperature for accuracy)
 */
export const skillExtractionLLM = initializeLLM({
    temperature: 0.2,
    modelName: process.env.OPENAI_MODEL || "gpt-4"
});

/**
 * LLM for chat (moderate temperature for natural conversation)
 */
export const chatLLM = initializeLLM({
    temperature: 0.3,
    modelName: process.env.OPENAI_MODEL || "gpt-4"
});

console.log('✅ LangChain initialized successfully');