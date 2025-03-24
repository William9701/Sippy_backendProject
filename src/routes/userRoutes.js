const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authMiddleware");
const { profile, me } = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     sessionCookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sessionId  # This should match your actual session cookie name
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.get("/me", authenticateUser, me);

module.exports = router;
