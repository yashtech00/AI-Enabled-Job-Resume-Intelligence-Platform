import 'dotenv/config';

import express from 'express';


import cors from "cors"
import jobRouter from './src/routes/job.routes.js';
import matchRouter from './src/routes/match.routes.js';
import chatRouter from './src/routes/chat.routes.js';
import resumeRouter from './src/routes/resume.routes.js';
import connectDB from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT || 5000
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use("/api/job", jobRouter);
app.use("/api/match", matchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/resume", resumeRouter);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();