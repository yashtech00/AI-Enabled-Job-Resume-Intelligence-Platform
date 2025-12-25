import jobModels from "../models/job.models.js";
import MatchModel from "../models/Match.model.js";
import ResumeModel from "../models/Resume.model.js";
import { extractSkills } from "../services/ai/skillExtraction.service.js";
import { calculateCosineSimilarity, generateEmbedding } from "../services/ai/embedding.service.js";

const normalizeSkills = (skills) => {
    const list = Array.isArray(skills) ? skills : [];
    const normalized = list
        .map((s) => (s ?? "").toString().toLowerCase().trim())
        .filter(Boolean);
    return Array.from(new Set(normalized));
};

const getJobSkills = async (job) => {
    const existing = normalizeSkills(job?.extractedSkills);
    if (existing.length > 0) return existing;

    const text = (job?.jobDescription ?? "").toString();
    if (!text.trim()) return [];

    try {
        const extracted = await extractSkills(text);
        return normalizeSkills(extracted);
    } catch (e) {
        return [];
    }
};

/**
 * @route   POST /api/match/analyze
 * @desc    Analyze single resume against a job
 * @body    { resumeId, jobId }
 */
export const analyzeResume = async (req, res) => {
    try {
        const { resumeId, jobId } = req.body;

        // Validation
        if (!resumeId || !jobId) {
            return res.status(400).json({ 
                success: false, 
                message: "resumeId and jobId are required" 
            });
        }

        // Fetch resume and job
        const resume = await ResumeModel.findById(resumeId);
        const job = await jobModels.findById(jobId);

        if (!resume || !job) {
            return res.status(404).json({ 
                success: false, 
                message: "Resume or Job not found" 
            });
        }

        const jobSkills = await getJobSkills(job);
        let jobEmbedding = [];
        try {
            jobEmbedding = await generateEmbedding(job?.jobDescription || job?.jobTitle || "");
        } catch (e) {
            jobEmbedding = [];
        }

        // Normalize skills to lowercase for better matching
        const resumeSkills = normalizeSkills(resume.extractedSkills);

        // Calculate matched and missing skills
        const matchedSkills = resumeSkills.filter(skill => 
            jobSkills.includes(skill)
        );
        
        const missingSkills = jobSkills.filter(skill => 
            !resumeSkills.includes(skill)
        );

        // Calculate match percentage
        const matchPercentage = jobSkills.length > 0 
            ? (matchedSkills.length / jobSkills.length) * 100 
            : 0;

        // Calculate scores for ranking
        // 1. Skill Match Score (0-100)
        const skillScore = matchPercentage;

        // 2. Semantic Score (how comprehensive the resume is)
        let semanticScore = 0;
        try {
            const resumeEmbedding = Array.isArray(resume?.embedding) ? resume.embedding : [];
            if (jobEmbedding?.length && resumeEmbedding?.length && jobEmbedding.length === resumeEmbedding.length) {
                const similarity = calculateCosineSimilarity(jobEmbedding, resumeEmbedding);
                semanticScore = Math.max(0, Math.min(100, similarity * 100));
            }
        } catch (e) {
            semanticScore = 0;
        }

        // 3. Experience Score (compare years of experience)
        let experienceScore = 0;
        const resumeYears = resume.experience?.totalYears || 0;
        
        // Map experience level to years
        const experienceLevelMap = {
            'Entry': 2,
            'Mid': 5,
            'Senior': 8,
            'Lead': 10
        };
        
        const requiredYears = experienceLevelMap[job.experienceLevel] || 5;
        
        if (resumeYears >= requiredYears) {
            experienceScore = 100;
        } else if (resumeYears > 0) {
            experienceScore = (resumeYears / requiredYears) * 100;
        }

        // Calculate final rank score (weighted average)
        // Skill Match: 50%, Experience: 30%, Semantic: 20%
        const rankScore = (
            (skillScore * 0.5) + 
            (experienceScore * 0.3) + 
            (semanticScore * 0.2)
        ).toFixed(2);

        // Update or create match
        const match = await MatchModel.findOneAndUpdate(
            { resumeId, jobId },
            {
                resumeId,
                jobId,
                matchPercentage: parseFloat(matchPercentage.toFixed(2)),
                matchedSkills,
                missingSkills,
                rankScore: parseFloat(rankScore),
                semanticScore: parseFloat(Number(semanticScore).toFixed(2)),
                experienceScore: parseFloat(experienceScore.toFixed(2))
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Match updated successfully", 
            data: match 
        });

    } catch (error) {
        console.error('Analyze match error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


/**
 * @route   GET /api/match/job/:jobId
 * @desc    Get all matches for a specific job
 * @query   { page, limit, minMatch, sortBy }
 */
export const getMatchesByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Filters
        const minMatch = parseFloat(req.query.minMatch) || 0;
        const sortBy = req.query.sortBy || 'rankScore'; // rankScore, matchPercentage, createdAt
        
        // Validate jobId
        if (!jobId) {
            return res.status(400).json({ 
                success: false, 
                message: "jobId is required" 
            });
        }

        // Check if job exists
        const job = await jobModels.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: "Job not found" 
            });
        }

        // Build query
        const query = { 
            jobId,
            matchPercentage: { $gte: minMatch }
        };

        // Get matches with populated resume data
        const matches = await MatchModel.find(query)
            .populate('resumeId', 'candidateName email phone extractedSkills experience')
            .sort({ [sortBy]: -1 }) // Descending order
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalMatches = await MatchModel.countDocuments(query);

        return res.status(200).json({ 
            success: true, 
            message: "Matches retrieved successfully",
            data: {
                matches,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalMatches / limit),
                    totalMatches,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get matches error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


/**
 * @route   POST /api/match/rank
 * @desc    Rank all resumes for a job (Top 10 or specified limit)
 * @body    { jobId, limit }
 */
export const rankResumesForJob = async (req, res) => {
    try {
        const { jobId, limit = 10 } = req.body;

        // Validation
        if (!jobId) {
            return res.status(400).json({ 
                success: false, 
                message: "jobId is required" 
            });
        }

        // Check if job exists
        const job = await jobModels.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: "Job not found" 
            });
        }

        // Get all resumes
        const allResumes = await ResumeModel.find();

        if (allResumes.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No resumes found in the system" 
            });
        }

        const jobSkills = await getJobSkills(job);
        let jobEmbedding = [];
        try {
            jobEmbedding = await generateEmbedding(job?.jobDescription || job?.jobTitle || "");
        } catch (e) {
            jobEmbedding = [];
        }

        // Analyze each resume (always recompute + upsert so stale matches get corrected)
        const matchPromises = allResumes.map(async (resume) => {
            const resumeSkills = normalizeSkills(resume?.extractedSkills);

            const matchedSkills = resumeSkills.filter((skill) => jobSkills.includes(skill));
            const missingSkills = jobSkills.filter((skill) => !resumeSkills.includes(skill));

            const matchPercentage = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;
            const skillScore = matchPercentage;

            let semanticScore = 0;
            try {
                const resumeEmbedding = Array.isArray(resume?.embedding) ? resume.embedding : [];
                if (jobEmbedding?.length && resumeEmbedding?.length && jobEmbedding.length === resumeEmbedding.length) {
                    const similarity = calculateCosineSimilarity(jobEmbedding, resumeEmbedding);
                    semanticScore = Math.max(0, Math.min(100, similarity * 100));
                }
            } catch (e) {
                semanticScore = 0;
            }

            const resumeYears = resume.experience?.totalYears || 0;
            const experienceLevelMap = { 'Entry': 2, 'Mid': 5, 'Senior': 8, 'Lead': 10 };
            const requiredYears = experienceLevelMap[job.experienceLevel] || 5;

            let experienceScore = 0;
            if (resumeYears >= requiredYears) {
                experienceScore = 100;
            } else if (resumeYears > 0) {
                experienceScore = (resumeYears / requiredYears) * 100;
            }

            const rankScore = (
                (skillScore * 0.5) +
                (experienceScore * 0.3) +
                (semanticScore * 0.2)
            ).toFixed(2);

            const match = await MatchModel.findOneAndUpdate(
                { resumeId: resume._id, jobId },
                {
                    resumeId: resume._id,
                    jobId,
                    matchPercentage: parseFloat(matchPercentage.toFixed(2)),
                    matchedSkills,
                    missingSkills,
                    rankScore: parseFloat(rankScore),
                    semanticScore: parseFloat(Number(semanticScore).toFixed(2)),
                    experienceScore: parseFloat(experienceScore.toFixed(2))
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            return match;
        });

        // Wait for all matches to be created/retrieved
        await Promise.all(matchPromises);

        // Get top ranked candidates
        const topCandidates = await MatchModel.find({ jobId })
            .populate('resumeId', 'candidateName email phone extractedSkills experience education')
            .sort({ rankScore: -1 }) // Highest rank first
            .limit(parseInt(limit));

        // If a resume was deleted, populate('resumeId') will return null.
        // Filter out these orphaned matches to avoid crashing the response.
        const validTopCandidates = topCandidates.filter((m) => m?.resumeId);

        // Format response
        const rankedCandidates = validTopCandidates.map((match, index) => ({
            rank: index + 1,
            resumeId: match.resumeId._id,
            candidateName: match.resumeId.candidateName,
            email: match.resumeId.email,
            phone: match.resumeId.phone,
            matchPercentage: match.matchPercentage,
            rankScore: match.rankScore,
            semanticScore: match.semanticScore,
            experienceScore: match.experienceScore,
            matchedSkills: match.matchedSkills,
            missingSkills: match.missingSkills,
            experience: match.resumeId.experience,
            education: match.resumeId.education
        }));

        return res.status(200).json({ 
            success: true, 
            message: `Top ${limit} candidates ranked successfully`,
            data: {
                jobId,
                jobTitle: job.jobTitle,
                totalCandidates: allResumes.length,
                topCandidates: rankedCandidates
            }
        });

    } catch (error) {
        console.error('Rank resumes error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


/**
 * @route   GET /api/match/:id
 * @desc    Get specific match details
 */
export const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;

        const match = await MatchModel.findById(id)
            .populate('resumeId', 'candidateName email phone extractedSkills experience education')
            .populate('jobId', 'jobTitle jobDescription extractedSkills company location experienceLevel');

        if (!match) {
            return res.status(404).json({ 
                success: false, 
                message: "Match not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: match 
        });

    } catch (error) {
        console.error('Get match by ID error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


/**
 * @route   DELETE /api/match/:id
 * @desc    Delete a specific match
 */
export const deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;

        const match = await MatchModel.findByIdAndDelete(id);

        if (!match) {
            return res.status(404).json({ 
                success: false, 
                message: "Match not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Match deleted successfully" 
        });

    } catch (error) {
        console.error('Delete match error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};