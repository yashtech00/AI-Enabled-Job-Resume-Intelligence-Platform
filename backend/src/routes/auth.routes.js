import express from "express"
import { register, login } from "../controller/auth.controller";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;