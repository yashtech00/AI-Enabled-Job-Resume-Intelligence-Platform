import express from "express";
import { analyzeResume, getMatchesByJob, rankResumesForJob, deleteMatch } from "../controller/match.controller.js";

const matchRouter = express.Router();

matchRouter.post("/analyze-resume", analyzeResume);
matchRouter.post("/rank-resume", rankResumesForJob);
matchRouter.get("/job/:jobId", getMatchesByJob);
matchRouter.delete("/delete-match/:id", deleteMatch);

export default matchRouter;