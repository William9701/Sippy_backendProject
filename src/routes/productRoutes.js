const express = require("express");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getLowStockProducts } = require("../controllers/productController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Product CRUD Endpoints
router.post("/", authenticateUser, createProduct); // Create Product
router.get("/", authenticateUser,  getProducts); // Get All Products
router.get("/:id", authenticateUser, getProductById); // Get Product by ID
router.put("/:id", authenticateUser, updateProduct); // Update Product
router.delete("/:id", authenticateUser, deleteProduct); // Delete Product
router.get("/low-stock", getLowStockProducts); // Get Low Stock Alerts


module.exports = router;
