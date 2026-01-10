import User from "../models/User.model.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const register = async (req, res) => {
    try {
        // Validate Input
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: result.error.format()
            });
        }

        const { name, email, password, role } = result.data;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create User
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        // Generate Token
        const token = generateToken(user._id);

        // Set Cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        // Validate Input
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: result.error.format()
            });
        }

        const { email, password } = result.data;

        // Find User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check Password
        if (await user.matchPassword(password)) {
            const token = generateToken(user._id);

            // Set Cookie
            res.cookie("accessToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refresh = async (req, res) => {
    // In a stateless JWT implementation with long-lived tokens, refresh might just re-issue or 
    // simply confirm the current token is valid if we had sliding sessions. 
    // Here we'll simple acknowledge for now as we used long lived 30d tokens.
    // For a proper refresh token flow, we'd need a separate Refresh Token in DB.
    res.json({ message: 'Refresh endpoint - Logic to be implemented if using short-lived access tokens' });
};

export const logout = (req, res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};