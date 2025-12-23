import express from "express";

const matchRouter = express.Router();

matchRouter.post("/match-resume", matchResume);
matchRouter.post("/match-resume/job/:jobId", matchAllResumeForJob);

export default matchRouter;