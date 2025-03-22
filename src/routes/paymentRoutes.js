const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");

const { initializePayment, verifyPayment } = require("../controllers/paymentController");
const router = express.Router();

router.post("/initialize", authenticateUser, initializePayment);
router.get("/verify", authenticateUser, verifyPayment);

module.exports = router;
