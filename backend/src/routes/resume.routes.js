import express from "express";
import { deleteResume, getResume, getResumeById, uploadResume } from "../controller/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.post("/upload", uploadResume);
resumeRouter.get("/get-resumes", getResume);
resumeRouter.get("/get-resume-by-id/:resumeId", getResumeById);
resumeRouter.delete("/delete-resume/:resumeId", deleteResume);


export default resumeRouter;