const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    cancelOrder
} = require("../controllers/orderController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and processing
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     sessionCookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sessionId  # Make sure this matches your actual session cookie name
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderType:
 *                 type: string
 *                 enum: [single, bulk]
 *                 example: "single"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "4fc4f345-4f05-425d-b7cf-cd5626547e64"
 *                     quantity:
 *                       type: integer
 *                       example: 50
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request - Validation failed
 */
router.post("/orders", authenticateUser, createOrder);


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/orders", authenticateUser, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a5b8d2c4b3e21a6a56d9f5"
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get("/orders/:id", authenticateUser, getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a5b8d2c4b3e21a6a56d9f5"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad request - Validation failed
 *       404:
 *         description: Order not found
 */
router.put("/orders/:id", authenticateUser, updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a5b8d2c4b3e21a6a56d9f5"
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       404:
 *         description: Order not found
 */
router.delete("/orders/:id", authenticateUser, cancelOrder);

module.exports = router;
