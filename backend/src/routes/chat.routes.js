import express from "express";

const chatRouter = express.Router();

chatRouter.post("/", chat);
chatRouter.get("/:resumeId", chatByResumeId);

export default chatRouter;