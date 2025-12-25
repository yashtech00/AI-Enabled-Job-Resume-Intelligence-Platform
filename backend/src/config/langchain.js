// src/config/langchain.js
import 'dotenv/config';
import { ChatGroq } from "@langchain/groq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


// Validate Groq API key
console.log(process.env.GROQ_API_KEY);
if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not set in environment variables');
    console.log('📝 Get FREE API key from: https://console.groq.com/keys');
    throw new Error('GROQ_API_KEY is required');
}

// Validate HuggingFace API key
if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY is not set in environment variables');
    console.log('📝 Get FREE API key from: https://huggingface.co/settings/tokens');
    throw new Error('HUGGINGFACE_API_KEY is required');
}

/**
 * Initialize Groq LLM (FREE & FAST)
 * Models available:
 * - llama-3.3-70b-versatile (Best quality)
 * - llama-3.1-8b-instant (Fastest)
 * - mixtral-8x7b-32768 (Good balance)
 */
export const initializeLLM = (options = {}) => {
    return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature !== undefined ? options.temperature : 0.3,
        maxTokens: options.maxTokens || 1500,
        ...options
    });
};

/**
 * Initialize HuggingFace Embeddings (FREE)
 * Using sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
 */
export const initializeEmbeddings = () => {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: "sentence-transformers/all-MiniLM-L6-v2"
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
    temperature: 0.1, // Very low for consistent extraction
    model: "llama-3.3-70b-versatile", // Best for structured output
    maxTokens: 1000
});

/**
 * LLM for chat (moderate temperature for natural conversation)
 */
export const chatLLM = initializeLLM({
    temperature: 0.3,
    model: "llama-3.3-70b-versatile",
    maxTokens: 2000
});

/**
 * Fast LLM for quick tasks
 */
export const fastLLM = initializeLLM({
    temperature: 0.2,
    model: "llama-3.1-8b-instant", // Fastest model
    maxTokens: 1000
});

console.log('✅ LangChain initialized with Groq (FREE)');
console.log('📊 Model: llama-3.3-70b-versatile');
console.log('🔢 Embeddings: sentence-transformers/all-MiniLM-L6-v2');
console.log('🔢 Embeddings: sentence-transformers/all-MiniLM-L6-v2');