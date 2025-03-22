const jwt = require("jsonwebtoken");
const  User  = require("../models/user");

const authenticateUser = async (req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(401).json({ message: "Unauthorized: No cookies found" });
        }

        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized: No session ID" });
        }

        // Retrieve token from database using session ID
        const user = await User.findOne({ where: { sessionId } });

        if (!user || !user.token) {
            return res.status(401).json({ message: "Unauthorized: No valid token" });
        }

        // Verify token
        jwt.verify(user.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token expired or invalid" });
            }

            req.user = decoded;
            next();  // Only proceed to next() if the token is valid
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { authenticateUser };
