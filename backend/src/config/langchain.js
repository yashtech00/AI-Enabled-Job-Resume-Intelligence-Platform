import 'dotenv/config';
import { ChatGroq } from "@langchain/groq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


console.log(process.env.GROQ_API_KEY);
if (!process.env.GROQ_API_KEY) {
    console.error(' GROQ_API_KEY is not set in environment variables');
    console.log(' Get FREE API key from: https://console.groq.com/keys');
    throw new Error('GROQ_API_KEY is required');
}

// Validate HuggingFace API key
if (!process.env.HUGGINGFACE_API_KEY) {
    console.error(' HUGGINGFACE_API_KEY is not set in environment variables');
    console.log(' Get FREE API key from: https://huggingface.co/settings/tokens');
    throw new Error('HUGGINGFACE_API_KEY is required');
}


export const initializeLLM = (options = {}) => {
    return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature !== undefined ? options.temperature : 0.3,
        maxTokens: options.maxTokens || 1500,
        ...options
    });
};

export const initializeEmbeddings = () => {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: "sentence-transformers/all-MiniLM-L6-v2"
    });
};


export const llm = initializeLLM();


export const embeddings = initializeEmbeddings();


export const skillExtractionLLM = initializeLLM({
    temperature: 0.1, // Very low for consistent extraction
    model: "llama-3.3-70b-versatile", // Best for structured output
    maxTokens: 1000
});


export const chatLLM = initializeLLM({
    temperature: 0.3,
    model: "llama-3.3-70b-versatile",
    maxTokens: 2000
});

export const fastLLM = initializeLLM({
    temperature: 0.2,
    model: "llama-3.1-8b-instant", // Fastest model
    maxTokens: 1000
});

console.log(' LangChain initialized with Groq (FREE)');
console.log(' Model: llama-3.3-70b-versatile');
console.log(' Embeddings: sentence-transformers/all-MiniLM-L6-v2');
console.log(' Embeddings: sentence-transformers/all-MiniLM-L6-v2');