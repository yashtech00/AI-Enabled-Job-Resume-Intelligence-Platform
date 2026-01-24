// routes/subscription.routes.js
import express from "express";
import {
    createSubscriptionCheckout,
    cancelSubscription
} from "../controllers/subscription.controller.js";
import Authentication from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Razorpay subscription (user must be logged in)
router.post(
    "/create",
    Authentication,
    createSubscriptionCheckout
);

// Cancel active subscription
router.post(
    "/cancel",
    Authentication,
    cancelSubscription
);

export default router;
