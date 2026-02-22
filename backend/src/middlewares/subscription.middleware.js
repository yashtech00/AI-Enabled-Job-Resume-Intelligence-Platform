import User from "../models/User.model.js";

const requireActiveSubscription = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || user.subscriptionStatus !== "active") {
        return res.status(403).json({
            success: false,
            message: "Active subscription required",
        });
    }

    next();
};

export default requireActiveSubscription;
