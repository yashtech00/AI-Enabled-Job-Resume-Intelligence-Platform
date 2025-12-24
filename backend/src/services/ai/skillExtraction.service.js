import openai from "openai";
import { skillExtractionLLM } from "../../config/langchain.js";

export const extractSkills = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty for skill extraction");
    }
    const promptTemplate = PromptTemplate.fromTemplate(`
            You are an expert HR assistant specialized in identifying technical and professional skills from resumes and job descriptions.
            
            Extract ALL relevant skills from the following text. Include:
            - Programming languages (e.g., JavaScript, Python, Java)
            - Frameworks and libraries (e.g., React, Django, Spring)
            - Tools and technologies (e.g., Docker, Git, AWS)
            - Databases (e.g., MongoDB, PostgreSQL, MySQL)
            - Soft skills (e.g., Leadership, Communication, Team Management)
            - Domain knowledge (e.g., Machine Learning, Cloud Computing, DevOps)
            
            Rules:
            1. Return skills as a comma-separated list
            2. Standardize skill names (e.g., "ReactJS" → "React", "NodeJS" → "Node.js")
            3. Remove duplicates
            4. Be comprehensive but avoid generic terms like "Microsoft Office"
            5. Each skill should be 1-3 words maximum
            6. Return ONLY the comma-separated list, no explanations
            
            Text:
            {text}
            
            Skills (comma-separated):
                    `);
    const chain = RunnableSequence.from([
      promptTemplate,
      skillExtractionLLM,
      new StringOutputPraser(),
    ]);

    const response = await chain.invoke({ text });

    const candidateInfo = JSON.parse(response);
    console.log(`✅ Extracted candidate info for: ${candidateInfo.name}`);

    return candidateInfo;
  } catch (error) {
    console.error("Candidate info extraction error:", error);

    // Return default structure if parsing fails
    return {
      name: "Unknown",
      email: null,
      phone: null,
      experience: {
        totalYears: 0,
        details: null,
      },
      education: [],
      summary: null,
    };
  }
};

export const standardizeSkills = async (skills) => {
  try {
    const promptTemplate = PromptTemplate.fromTemplate(`
Standardize the following skill names to their most common industry format:
- ReactJS, React.js → React
- NodeJS, Node → Node.js
- MongoDB, Mongo → MongoDB
- Javascript → JavaScript
- etc.

Skills: {skills}

Return as comma-separated list of standardized skill names only.

Standardized skills:
        `);

    const chain = RunnableSequence.from([
      promptTemplate,
      skillExtractionLLM,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke({
      skills: skills.join(", "),
    });

    const standardized = response
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    return standardized;
  } catch (error) {
    console.error("Skill standardization error:", error);
    return skills; // Return original if standardization fails
  }
};
