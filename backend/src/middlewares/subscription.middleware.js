import UserModel from "../models/User.model";

const requireActiveSubscription = async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);

    if (!user || user.subscriptionStatus !== "active") {
        return res.status(403).json({
            success: false,
            message: "Active subscription required",
        });
    }

    next();
};

export default requireActiveSubscription;
