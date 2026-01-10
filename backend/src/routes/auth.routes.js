import express from "express";
import { register, login, refresh, logout, me } from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Public Routes
authRouter.post('/register', register);
authRouter.post('/login', login);

// Protected Routes
authRouter.post('/refresh', verifyToken, refresh);
authRouter.post('/logout', verifyToken, logout);
authRouter.get('/me', verifyToken, me);

export default authRouter;