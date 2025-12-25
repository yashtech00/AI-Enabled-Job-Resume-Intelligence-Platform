
export const formatConversationHistory = (messages, lastN = 5) => {
    try {
        if (!messages || messages.length === 0) {
            return "No previous conversation.";
        }

        const recentMessages = messages.slice(-lastN);
        
        const formatted = recentMessages
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        return `Previous Conversation:\n${formatted}`;

    } catch (error) {
        console.error('Format conversation history error:', error);
        return "No previous conversation.";
    }
};

export const extractTopics = (messages) => {
    try {
        const topics = new Set();

        const topicKeywords = {
            'experience': ['experience', 'work', 'job', 'role', 'position'],
            'skills': ['skill', 'technology', 'tech', 'programming', 'language'],
            'education': ['education', 'degree', 'university', 'college', 'study'],
            'projects': ['project', 'built', 'developed', 'created'],
            'achievements': ['achievement', 'award', 'accomplishment'],
            'salary': ['salary', 'compensation', 'pay'],
            'availability': ['available', 'join', 'start', 'notice']
        };

        messages.forEach(msg => {
            const content = msg.content.toLowerCase();
            
            Object.entries(topicKeywords).forEach(([topic, keywords]) => {
                if (keywords.some(keyword => content.includes(keyword))) {
                    topics.add(topic);
                }
            });
        });

        return Array.from(topics);

    } catch (error) {
        console.error('Extract topics error:', error);
        return [];
    }
};


export const buildMemoryContext = (conversation, resume) => {
    try {
        const topics = extractTopics(conversation.messages || []);

        return {
            candidateName: resume.candidateName,
            candidateId: resume._id,
            skills: resume.extractedSkills || [],
            totalYears: resume.experience?.totalYears || 0,
            discussedTopics: topics,
            messageCount: conversation.messages?.length || 0,
            lastUpdated: new Date(),
            summary: generateConversationSummary(conversation.messages || [])
        };

    } catch (error) {
        console.error('Build memory context error:', error);
        return {};
    }
};


export const generateConversationSummary = (messages) => {
    try {
        if (!messages || messages.length === 0) {
            return "No conversation yet.";
        }

        const userQuestions = messages
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content);

        if (userQuestions.length === 0) {
            return "No questions asked yet.";
        }

        const topics = extractTopics(messages);
        const topicsStr = topics.length > 0 
            ? `Discussed topics: ${topics.join(', ')}` 
            : "General conversation";

        return `${userQuestions.length} questions asked. ${topicsStr}.`;

    } catch (error) {
        console.error('Generate summary error:', error);
        return "Error generating summary.";
    }
};


export const wasTopicDiscussed = (memoryContext, topic) => {
    try {
        if (!memoryContext || !memoryContext.discussedTopics) {
            return false;
        }

        return memoryContext.discussedTopics.includes(topic.toLowerCase());

    } catch (error) {
        console.error('Check topic error:', error);
        return false;
    }
};