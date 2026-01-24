import express from "express";
import { deleteResume, downloadResume, getResume, getResumeById, uploadResume } from "../controller/resume.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import requireActiveSubscription from "../middlewares/subscription.middleware.js";

const resumeRouter = express.Router();

resumeRouter.use(verifyToken);

resumeRouter.post("/upload", upload.single("resume"), requireActiveSubscription, uploadResume);
resumeRouter.get("/get-resumes", requireActiveSubscription, getResume);
resumeRouter.get("/get-resume-by-id/:resumeId", requireActiveSubscription, getResumeById);
resumeRouter.get("/download/:resumeId", requireActiveSubscription, downloadResume);
resumeRouter.delete("/delete-resume/:resumeId", requireActiveSubscription, deleteResume);

export default resumeRouter;