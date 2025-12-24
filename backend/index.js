import express from 'express';
import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import jobRouter from './src/routes/job.routes.js';
import matchRouter from './src/routes/match.routes.js';
import chatRouter from './src/routes/chat.routes.js';
import resumeRouter from './src/routes/resume.routes.js';


const app = express();
const PORT = process.env.PORT
app.use(cors());

app.use("/api/job", jobRouter);
app.use("/api/match", matchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/resume", resumeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});