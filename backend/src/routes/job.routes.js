import express from "express";
import { createJob, getAllJobs, getJobById, scrapeJobs } from "../controller/job.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const jobRouter = express.Router();

jobRouter.use(verifyToken);

jobRouter.post("/create-job", createJob);
jobRouter.post("/scrape-jobs", scrapeJobs);

jobRouter.get("/get-all-jobs", getAllJobs);
jobRouter.get("/get-job-by-id/:jobId", getJobById);


export default jobRouter;