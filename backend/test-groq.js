// test-groq.js
import 'dotenv/config';
import { embeddings, skillExtractionLLM } from "./src/config/langchain.js";




async function test() {
    try {
        console.log('🧪 Testing Groq LLM...');
        
        // Test LLM
        const response = await skillExtractionLLM.invoke(
            "Extract skills: I have 5 years of React, Node.js, and MongoDB experience"
        );
        console.log('✅ LLM Response:', response.content);
        
        // Test Embeddings
        console.log('\n🧪 Testing HuggingFace Embeddings...');
        const embedding = await embeddings.embedQuery("Hello world");
        console.log(`✅ Embedding dimensions: ${embedding.length}`);
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

test();