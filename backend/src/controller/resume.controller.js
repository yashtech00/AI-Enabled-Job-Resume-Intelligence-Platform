import fs from 'fs/promises';   
import path from 'path';
import Resume from '../models/Resume.model.js';
import { extractCandidateInfo as extractCandidateInfoAI, extractSkills } from '../services/ai/skillExtraction.service.js';
import { generateEmbedding } from '../services/ai/embedding.service.js';
import { extractCandidateInfo as extractCandidateInfoBasic, extractTextFromPDF } from '../services/pdfParser.service.js';


export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // 1️⃣ Parse PDF
    const text = await extractTextFromPDF(filePath);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not extract any text from the uploaded PDF. If this is a scanned image PDF, please upload a text-based PDF.",
      });
    }

    // 2️⃣ Extract skills
    let skills = [];
    try {
      skills = await extractSkills(text);
    } catch (e) {
      console.error("Skill extraction failed, continuing without skills:", e);
    }

    // 3️⃣ Extract candidate info
    const basicInfo = await extractCandidateInfoBasic(text);
    let aiInfo = null;
    try {
      aiInfo = await extractCandidateInfoAI(text);
    } catch (e) {
      aiInfo = null;
    }

    const info = {
      name: aiInfo?.name || basicInfo?.name,
      email: aiInfo?.email || basicInfo?.email,
      phone: aiInfo?.phone || basicInfo?.phone,
      experience: aiInfo?.experience || basicInfo?.experience,
      education: aiInfo?.education || basicInfo?.education,
      summary: aiInfo?.summary,
    };

    // 4️⃣ Generate embedding
    let embedding = [];
    try {
      embedding = await generateEmbedding(text);
    } catch (e) {
      console.error("Embedding generation failed, continuing without embedding:", e);
    }

    // 5️⃣ Save to DB
    const resume = await Resume.create({
      candidateName: info.name || "Unknown",
      email: info.email,
      phone: info.phone,
      experience: info.experience,
      education: Array.isArray(info.education) ? info.education : [],
      extractedSkills: skills,
      extractedText: text,
      embedding: embedding,
      summary: info.summary,
      filePath: filePath,
      originalFileName: req.file.originalname,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // cleanup uploaded file if something fails
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }

    const absolutePath = path.isAbsolute(resume.filePath)
      ? resume.filePath
      : path.resolve(process.cwd(), resume.filePath);

    try {
      await fs.access(absolutePath);
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server'
      });
    }

    res.download(absolutePath, resume.originalFileName);
    
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const totalResumes = await Resume.countDocuments();
    const resumes = await Resume.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    return res.status(200).json({
      success: true,
      message: "Resumes fetched successfully",
      data: {
        resumes,
        totalResumes,
        page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      data: resume,
    });
        } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findByIdAndDelete(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};