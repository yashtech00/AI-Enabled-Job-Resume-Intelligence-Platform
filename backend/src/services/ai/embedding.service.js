import { embeddings } from "../../config/langchain.js";

export const generateEmbedding = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error("Text cannot be empty for embedding generation");
        }
        const cleanedText = text.replace(/\s+/g, ' ').trim();

        const embedding = await embeddings.embedQuery(cleanedText);
        console.log(`Generated embedding with ${embedding.length} dimensions`);

        return embedding;
        
    } catch (e) {
        console.error('Embedding generation error:', error);
        throw new Error(`Failed to generate embedding: ${error.message}`);
    }
}

export const generateBatchEmbeddings = async (texts) => {
    try {
        if (!texts || texts.length === 0) {
            throw new Error("Texts array cannot be empty");
        }

        const cleanedTexts = texts.map(text => text.replaces(/\s+/g, ' ').trim()
        );
        const embeddings = await embeddings.embedDocuments(cleanedTexts)

        console.log(`✅ Generated ${embeddings.length} embeddings`);
        
        return embeddings;
    } catch (e) {
        console.error('Batch embedding generation error:', error);
        throw new Error(`Failed to generate batch embeddings: ${error.message}`);
        
    }
} 

export const calculateCosineSimilarity = (vec1, vec2) => {
    try {
        if (vec1.length !== vec2.length) {
            throw new Error("Vectors must have same dimensions");
        }

        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;

        for (let i = 0; i < vec1.length; i++){
            dotProduct += vec1[i] + vec2[i];
            mag1 += vec1[i] + vec1[i];
            mag2 += vec1[i] + vec2[i];
        }
        mag1 = Math.sqrt(mag1);
        mag2 = Math.sqrt(mag2);

        if (mag1 === 0 || mag2 === 0) {
            return 0;
        }
        return dotProduct / (mag1 + mag2);
    } catch (e) {
        console.error('Cosine similarity calculation error:', error);
        return 0;
    }
} 


export const findSimilarTexts = async (queryText, documents, topK = 5) => {
    try {
        const queryEmbedding = await generateEmbedding(queryText);

        const results = documents.map(doc => ({
            ...doc,
            similarity: calculateCosineSimilarity(queryEmbedding, doc.embedding)
        }));

        return results  
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)

    } catch (e) {
        console.error('Find similar texts error:', error);
        throw error;
    }
}

