import express from "express";
import { createJob, getAllJobs, getJobById } from "../controller/job.controller.js";

const jobRouter = express.Router();

jobRouter.post("/create-job", createJob);
jobRouter.get("/get-all-jobs", getAllJobs);
jobRouter.get("/get-job-by-id/:jobId", getJobById);
jobRouter.get("/:jobId/top-resumes", getTopResumes);


export default jobRouter;