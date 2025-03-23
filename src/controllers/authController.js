const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        const existingUser = await User.findOne({where: {email } });
        if (existingUser) return res.status(400).json({message: "User already exists."});

        const newUser = await User.create({ fullName, email, password, role});

        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Generate session ID
        const sessionId = Math.random().toString(36).substring(2, 15);  

        // Store token and session ID in the database
        await User.update(
            { token, sessionId }, 
            { where: { id: user.id } }
        );

        // Set session ID in cookie
        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.sessionId) {
            return res.status(400).json({ message: "No active session found" });
        }

        const sessionId = req.cookies.sessionId;

        // Find user by sessionId
        const user = await User.findOne({ where: { sessionId } });

        if (!user) {
            return res.status(400).json({ message: "Invalid session" });
        }

        // Clear session ID and token from the database
        await user.update({ sessionId: null, token: null });

        // Clear cookies
        res.clearCookie("sessionId");

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { 
    register,
    login,
    logoutUser
};
