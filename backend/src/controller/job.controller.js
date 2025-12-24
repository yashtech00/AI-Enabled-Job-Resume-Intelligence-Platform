import { success } from "zod";
import Job from "../models/job.models.js";
import { jobSchema } from "../validation/job.validation.js";

export const createJob = async (req, res) => {
  try {
    const validation = jobSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid title or description",
        errors: validation.error.errors,
      });
    }

    const { title, description } = validation.data;

    const job = await Job.create({
      title,
      description,
    });

    return res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const scrapeJobs = async (req, res) => {
  try {
    const { url } = req.body;

    const jobs = await scrapeJobsFromUrl(url);

    return res.status(200).json({
      message: "Jobs scraped successfully",
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const pages = parseInt(req.query.pages) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (pages - 1) * limit;
    const totalJobs = await Job.countDocuments();

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      pagination: {
        totalItems: totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: pages,
        pageSize: limit,
      },
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ data: job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

