

import { razorpay } from "../config/razorpay.js";

export const cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.razorpaySubscriptionId) {
            return res.status(400).json({
                success: false,
                message: "No active subscription found",
            });
        }

        await razorpay.subscriptions.cancel(
            user.razorpaySubscriptionId,
            true
        );

        user.subscriptionStatus = "cancelled";
        user.subscriptionTier = "Free";
        user.credits = 5;
        user.razorpaySubscriptionId = null;

        await user.save();

        res.json({
            success: true,
            message: "Subscription cancelled successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel subscription",
        });
    }
};



export const activateSubscription = async ({
    userId,
    subscriptionId,
    tier,
}) => {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error("User not found");

    user.subscriptionTier = tier; // Pro / Enterprise
    user.razorpaySubscriptionId = subscriptionId;
    user.subscriptionStatus = "active";
    user.subscriptionStartDate = new Date();

    // Example: monthly plan
    user.subscriptionEndDate = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
    );

    // Increase credits on paid plan
    if (tier === "Pro") user.credits = 50;
    if (tier === "Enterprise") user.credits = 200;

    await user.save();
};


/**
 * Create Razorpay Subscription
 * POST /api/subscription/create
 */
export const createSubscriptionCheckout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { planId, tier } = req.body;

        if (!planId || !tier) {
            return res.status(400).json({
                success: false,
                message: "planId and tier are required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Create subscription on Razorpay
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 12, // example: 12 billing cycles
            notes: {
                userId: user._id.toString(),
                tier,
                email: user.email,
            },
        });

        // Save subscription reference (inactive until webhook confirms)
        user.razorpaySubscriptionId = subscription.id;
        user.subscriptionStatus = "inactive";
        await user.save();

        return res.status(200).json({
            success: true,
            subscriptionId: subscription.id,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Create Subscription Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create subscription",
        });
    }
};
