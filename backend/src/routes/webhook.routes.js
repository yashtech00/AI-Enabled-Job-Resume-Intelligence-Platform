// routes/webhook.routes.js
import express from "express";
import { razorpayWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Raw body needed for signature verification
router.post(
    "/razorpay",
    express.raw({ type: "application/json" }),
    razorpayWebhook
);

export default router;
