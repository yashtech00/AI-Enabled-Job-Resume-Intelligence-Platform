// src/services/embeddingService.js
import { embeddings } from "../../config/langchain.js";

/**
 * Generate embedding vector for text using HuggingFace (FREE)
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector (384 dimensions)
 */
export const generateEmbedding = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error("Text cannot be empty for embedding generation");
        }

        // Clean and limit text
        const cleanedText = text
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 5000); // HuggingFace limit

        // Generate embedding
        const embedding = await embeddings.embedQuery(cleanedText);

        console.log(`✅ Generated embedding: ${embedding.length} dimensions`);
        
        return embedding;

    } catch (error) {
        console.error('❌ Embedding generation error:', error.message);
        
        // Return zero vector as fallback (384 dimensions for all-MiniLM-L6-v2)
        console.log('⚠️ Returning zero vector fallback');
        return new Array(384).fill(0);
    }
};

/**
 * Generate embeddings for multiple texts
 */
export const generateBatchEmbeddings = async (texts) => {
    try {
        if (!texts || texts.length === 0) {
            throw new Error("Texts array cannot be empty");
        }

        // Clean all texts
        const cleanedTexts = texts.map(text => 
            text.replace(/\s+/g, ' ').trim().substring(0, 5000)
        );

        // Generate embeddings
        const embeddingVectors = await embeddings.embedDocuments(cleanedTexts);

        console.log(`✅ Generated ${embeddingVectors.length} embeddings`);
        
        return embeddingVectors;

    } catch (error) {
        console.error('❌ Batch embedding error:', error.message);
        
        // Return zero vectors as fallback
        return texts.map(() => new Array(384).fill(0));
    }
};

/**
 * Calculate cosine similarity between two vectors
 */
export const calculateCosineSimilarity = (vec1, vec2) => {
    try {
        if (vec1.length !== vec2.length) {
            throw new Error("Vectors must have same dimensions");
        }

        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            mag1 += vec1[i] * vec1[i];
            mag2 += vec2[i] * vec2[i];
        }

        mag1 = Math.sqrt(mag1);
        mag2 = Math.sqrt(mag2);

        if (mag1 === 0 || mag2 === 0) {
            return 0;
        }

        return dotProduct / (mag1 * mag2);

    } catch (error) {
        console.error('❌ Cosine similarity error:', error.message);
        return 0;
    }
};