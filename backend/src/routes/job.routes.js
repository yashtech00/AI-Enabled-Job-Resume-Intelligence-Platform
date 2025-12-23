import express from "express";

const jobRouter = express.Router();

jobRouter.post("/create-job", createJob);
jobRouter.get("/get-all-jobs", getAllJobs);
jobRouter.get("/get-job-by-id/:jobId", getJobById);
jobRouter.get("/:jobId/top-resumes", getTopResumes);


export default jobRouter;