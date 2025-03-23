const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { initializePayment, verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and verification
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     sessionCookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sessionId  # Ensure this matches your session cookie name
 */

/**
 * @swagger
 * /payment/initialize:
 *   post:
 *     summary: Initialize a payment
 *     tags: [Payments]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "e7052ea1-3b64-4785-aff5-ad4a7ecc09f1"
 *               authorization_code:
 *                 type: string
 *                 example: "AUTH_utbbu96ytq"
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       400:
 *         description: Bad request - Missing or invalid parameters
 */
router.post("/initialize", authenticateUser, initializePayment);

/**
 * @swagger
 * /payment/verify:
 *   get:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: The reference ID of the payment to verify
 *         example: "order_e7052ea1-3b64-4785-aff5-ad4a7ecc09f1_1742757256329"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid or expired payment reference
 */
router.get("/verify", authenticateUser, verifyPayment);

module.exports = router;
