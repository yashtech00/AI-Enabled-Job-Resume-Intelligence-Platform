import express from "express";

const resumeRouter = express.Router();

resumeRouter.post("/upload", uploadResume);
resumeRouter.get("/get-resumes", getResume);
resumeRouter.get("/get-resume-by-id/:resumeId", getResumeById);


export default resumeRouter;