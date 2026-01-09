
import { skillExtractionLLM } from "../../config/langchain.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


export const extractSkills = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            console.warn(" Empty text provided for skill extraction");
            return [];
        }

        // Limit text length to avoid token limits
        const limitedText = text.substring(0, 4000);

        const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert technical recruiter analyzing resumes.

Extract ALL relevant technical and professional skills from the text below.

Include these categories:
- Programming Languages: JavaScript, Python, Java, C++, etc.
- Frameworks: React, Angular, Django, Spring, etc.
- Tools: Docker, Git, Jenkins, Kubernetes, etc.
- Databases: MongoDB, PostgreSQL, MySQL, Redis, etc.
- Cloud: AWS, Azure, GCP, etc.
- Other: AI/ML, DevOps, Agile, etc.

IMPORTANT RULES:
1. Return ONLY a comma-separated list
2. Each skill should be 1-3 words
3. Standardize names: "ReactJS" → "React", "NodeJS" → "Node.js"
4. No explanations, no numbers, no extra text
5. Maximum 40 skills

Text:
{text}

Skills (comma-separated only):
        `);

        const chain = promptTemplate
            .pipe(skillExtractionLLM)
            .pipe(new StringOutputParser());

        const response = await chain.invoke({ text: limitedText });

        // Parse and clean skills
        const skills = String(response)
            .replace(/```/g, '') // Remove markdown
            .replace(/Skills:/gi, '') // Remove "Skills:" prefix
            .replace(/\n/g, ',') // Replace newlines with commas
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 40) // Filter valid skills
            .filter(s => !/^\d+\./.test(s)) // Remove numbered items
            .slice(0, 40); // Limit to 40 skills

        // Remove duplicates
        const uniqueSkills = Array.from(new Set(
            skills.map(s => s.toLowerCase())
        )).map(s => {
            // Find original casing
            return skills.find(skill => skill.toLowerCase() === s) || s;
        });

        console.log(` Extracted ${uniqueSkills.length} skills using Groq`);
        
        return uniqueSkills;

    } catch (error) {
        console.error(" Skill extraction error:", error.message);
        
        // Fallback: Use keyword matching
        return extractSkillsFallback(text);
    }
};


const extractSkillsFallback = (text) => {
    console.log(" Using fallback skill extraction");
    
    const commonSkills = [
        // Programming Languages
        'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
        'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
        
        // Frontend
        'React', 'Angular', 'Vue.js', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind',
        'Bootstrap', 'jQuery', 'Redux', 'Webpack',
        
        // Backend
        'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'Ruby on Rails',
        'ASP.NET', 'Laravel', 'NestJS',
        
        // Databases
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'DynamoDB', 'SQLite',
        'Oracle', 'SQL Server', 'Elasticsearch',
        
        // Cloud & DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform',
        'Ansible', 'Linux', 'Git', 'GitHub', 'GitLab',
        
        // AI/ML
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
        'NLP', 'Computer Vision',
        
        // Other
        'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA', 'WebSocket'
    ];

    const lowerText = text.toLowerCase();
    const found = commonSkills.filter(skill => 
        lowerText.includes(skill.toLowerCase())
    );

    console.log(` Fallback found ${found.length} skills`);
    return found.slice(0, 30);
};


export const extractCandidateInfo = async (resumeText) => {
    try {
        const limitedText = resumeText.substring(0, 3000);

        const promptTemplate = PromptTemplate.fromTemplate(`
Extract candidate information from this resume.

Resume:
{resumeText}

Return ONLY valid JSON (no markdown, no extra text):
{{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "experience": {{
    "totalYears": 5,
    "details": "Brief summary"
  }},
  "education": [
    {{
      "degree": "B.Tech Computer Science",
      "institution": "University Name",
      "year": "2020"
    }}
  ],
  "summary": "Professional summary"
}}

If information not found, use null.
JSON:
        `);

        const chain = promptTemplate
            .pipe(skillExtractionLLM)
            .pipe(new StringOutputParser());

        const response = await chain.invoke({ resumeText: limitedText });

        // Clean and parse JSON
        let jsonStr = response.trim();
        
        // Remove markdown code blocks
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Find JSON object
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        const candidateInfo = JSON.parse(jsonStr);

        console.log(` Extracted candidate info: ${candidateInfo.name}`);
        
        return candidateInfo;

    } catch (error) {
        console.error("Candidate info extraction error:", error.message);
        
        // Return default structure
        return {
            name: "Unknown Candidate",
            email: null,
            phone: null,
            experience: {
                totalYears: 0,
                details: null
            },
            education: [],
            summary: null
        };
    }
};

