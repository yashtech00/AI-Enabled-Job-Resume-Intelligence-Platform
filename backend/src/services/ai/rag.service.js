// src/services/ragService.js
import { chatLLM, embeddings } from "../../config/langchain.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { TokenTextSplitter } from "@langchain/textsplitters";

/**
 * Split text into chunks for RAG (Token-based)
 */
export const splitTextIntoChunks = async (text, options = {}) => {
  try {
    const splitter = new TokenTextSplitter({
      chunkSize: options.chunkSize || 300,
      chunkOverlap: options.chunkOverlap || 50,
    });

    const chunks = await splitter.splitText(text);

    console.log(`✅ Split text into ${chunks.length} token-based chunks`);

    return chunks;
  } catch (error) {
    console.error("Text splitting error:", error);
    throw new Error(`Failed to split text: ${error.message}`);
  }
};


/**
 * Create in-memory vector store from text chunks
 * @param {string[]} chunks - Text chunks
 * @param {Object[]} metadata - Metadata for each chunk
 * @returns {Promise<MemoryVectorStore>} - Vector store
 */
export const createVectorStore = async (chunks, metadata = null) => {
    try {
        const metadataArray = metadata || chunks.map((_, i) => ({ 
            chunkId: i,
            timestamp: new Date()
        }));

        const vectorStore = await MemoryVectorStore.fromTexts(
            chunks,
            metadataArray,
            embeddings
        );

        console.log(`✅ Created vector store with ${chunks.length} documents`);
        
        return vectorStore;

    } catch (error) {
        console.error('Vector store creation error:', error);
        throw new Error(`Failed to create vector store: ${error.message}`);
    }
};

/**
 * Perform similarity search on vector store
 * @param {MemoryVectorStore} vectorStore - Vector store
 * @param {string} query - Search query
 * @param {number} k - Number of results
 * @returns {Promise<Array>} - Similar documents
 */
export const similaritySearch = async (vectorStore, query, k = 3) => {
    try {
        const results = await vectorStore.similaritySearch(query, k);
        
        console.log(`✅ Found ${results.length} similar documents`);
        
        return results;

    } catch (error) {
        console.error('Similarity search error:', error);
        throw new Error(`Failed to perform similarity search: ${error.message}`);
    }
};

/**
 * Create RAG chain for Q&A
 * @param {string} resumeText - Full resume text
 * @param {string} question - User question
 * @param {Object} context - Additional context (conversation history, etc.)
 * @returns {Promise<string>} - AI response
 */
export const performRAG = async (resumeText, question, context = {}) => {
    try {
        // Step 1: Split resume into chunks
        const chunks = await splitTextIntoChunks(resumeText);

        // Step 2: Create vector store
        const vectorStore = await createVectorStore(chunks);

        // Step 3: Find relevant chunks
        const relevantDocs = await similaritySearch(vectorStore, question, 3);
        const retrievedContext = relevantDocs
            .map(doc => doc.pageContent)
            .join("\n\n");

        // Step 4: Build prompt with context
        const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful HR assistant analyzing a candidate's resume.

Resume Context (Most Relevant Sections):
{retrievedContext}

{conversationHistory}

Additional Information:
- Candidate Name: {candidateName}
- Total Experience: {totalYears} years
- Skills: {skills}

Question: {question}

Instructions:
- Answer based ONLY on the resume information provided
- Be specific and cite details from the resume
- If information is not in the resume, say "This information is not mentioned in the resume"
- Be professional and concise

Answer:
        `);

        // Step 5: Create chain
        const chain = RunnableSequence.from([
            promptTemplate,
            chatLLM,
            new StringOutputParser()
        ]);

        // Step 6: Invoke chain
        const response = await chain.invoke({
            retrievedContext: retrievedContext,
            conversationHistory: context.conversationHistory || "",
            candidateName: context.candidateName || "Unknown",
            totalYears: context.totalYears || 0,
            skills: context.skills || "Not specified",
            question: question
        });

        console.log(`✅ RAG response generated`);
        
        return response;

    } catch (error) {
        console.error('RAG error:', error);
        throw new Error(`Failed to perform RAG: ${error.message}`);
    }
};

/**
 * Batch RAG for multiple questions
 * @param {string} resumeText - Full resume text
 * @param {string[]} questions - Array of questions
 * @param {Object} context - Additional context
 * @returns {Promise<Array>} - Array of Q&A pairs
 */
export const batchRAG = async (resumeText, questions, context = {}) => {
    try {
        // Create vector store once for all questions
        const chunks = await splitTextIntoChunks(resumeText);
        const vectorStore = await createVectorStore(chunks);

        const results = await Promise.all(
            questions.map(async (question) => {
                const relevantDocs = await similaritySearch(vectorStore, question, 3);
                const retrievedContext = relevantDocs
                    .map(doc => doc.pageContent)
                    .join("\n\n");

                const promptTemplate = PromptTemplate.fromTemplate(`
Resume Context: {retrievedContext}
Question: {question}
Answer concisely:
                `);

                const chain = RunnableSequence.from([
                    promptTemplate,
                    chatLLM,
                    new StringOutputParser()
                ]);

                const answer = await chain.invoke({
                    retrievedContext: retrievedContext,
                    question: question
                });

                return {
                    question: question,
                    answer: answer
                };
            })
        );

        console.log(`✅ Batch RAG completed for ${questions.length} questions`);
        
        return results;

    } catch (error) {
        console.error('Batch RAG error:', error);
        throw new Error(`Failed to perform batch RAG: ${error.message}`);
    }
};