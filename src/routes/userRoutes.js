const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authMiddleware");
const { profile } = require("../controllers/userController");

router.get("/profile", authenticateUser, profile);

module.exports = router;
