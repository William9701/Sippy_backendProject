const  User  = require("../models/user");
const profile = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({
            where: { email },
            attributes: ["fullName", "email", "sessionId"]
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { profile };
