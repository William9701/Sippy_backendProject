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

router.post("/orders", authenticateUser, createOrder);
router.get("/orders", authenticateUser, getOrders);
router.get("/orders/:id", authenticateUser, getOrderById);
router.put("/orders/:id", authenticateUser, updateOrder);
router.delete("/orders/:id", authenticateUser, cancelOrder);

module.exports = router;
