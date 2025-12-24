import fs from 'fs/promises';   
import Resume from '../models/Resume.model.js';
import { extractSkills } from '../services/ai/skillExtraction.service.js';
import { generateEmbedding } from '../services/ai/embedding.service.js';


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

    // 2️⃣ Extract skills
    const skills = await extractSkills(text);

    // 3️⃣ Extract candidate info
    const info = await extractCandidateInfo(text);

    // 4️⃣ Generate embedding
    const embedding = await generateEmbedding(text);

    // 5️⃣ Save to DB
    const resume = await Resume.create({
      candidateName: info.name || "Unknown",
      email: info.email,
      phone: info.phone,
      experience: info.experience,
      education: info.education,
      extractedSkills: skills,
      extractedText: text,
      embedding: embedding,
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
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }

    res.download(resume.filePath, resume.originalFileName);
    
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