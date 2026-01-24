import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    subscriptionTier: {
        type: String,
        enum: ["Free", "Pro", "Enterprise"],
        default: "Free",
    },

    razorpayCustomerId: String,

    razorpaySubscriptionId: String,

    subscriptionStatus: {
        type: String,
        enum: ["inactive", "active", "cancelled"],
        default: "inactive",
    },

    subscriptionStartDate: Date,
    subscriptionEndDate: Date,

    credits: { type: Number, default: 5 },

    usageMetadata: {
        resumesUploaded: { type: Number, default: 0 },
        lastResetDate: { type: Date, default: Date.now },
    },
}, { timestamps: true });

/* Hash password */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
