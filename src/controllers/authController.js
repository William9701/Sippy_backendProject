const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({where: {email } });
        if (existingUser) return res.status(400).json({message: "User already exists."});

        const newUser = await User.create({ fullName, email, password});

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

module.exports = {
    register,
    login
};