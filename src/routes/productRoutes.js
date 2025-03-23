const express = require("express");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts
} = require("../controllers/productController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and inventory
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
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop fr"
 *               description:
 *                 type: string
 *                 example: "High-performance laptop"
 *               price:
 *                 type: number
 *                 example: 999.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.post("/", authenticateUser, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.get("/", authenticateUser, getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *         example: "65c5f5a2d456d3123b4c7e99"
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", authenticateUser, getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Laptop"
 *               description:
 *                 type: string
 *                 example: "Improved performance"
 *               price:
 *                 type: number
 *                 example: 1099.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized - User must be logged in
 *       404:
 *         description: Product not found
 */
router.put("/:id", authenticateUser, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized - User must be logged in
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authenticateUser, deleteProduct);

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of low-stock products
 */
router.get("/low-stock", getLowStockProducts);

module.exports = router;
