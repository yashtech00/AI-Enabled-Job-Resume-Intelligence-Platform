import express from "express";
import { deleteResume, downloadResume, getResume, getResumeById, uploadResume } from "../controller/resume.controller.js";
import upload from "../middlewares/upload.middleware.js";

const resumeRouter = express.Router();

resumeRouter.post("/upload", upload.single("resume"), uploadResume);
resumeRouter.get("/get-resumes", getResume);
resumeRouter.get("/get-resume-by-id/:resumeId", getResumeById);
resumeRouter.get("/download/:resumeId", downloadResume);
resumeRouter.delete("/delete-resume/:resumeId", deleteResume);

export default resumeRouter;