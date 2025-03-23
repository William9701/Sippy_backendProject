const axios = require("axios");
const { Order } = require("../models/order");
const  User  = require("../models/user");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

// Initialize Payment
const initializePayment = async (req, res) => {
    try {
        const { orderId, authorization_code } = req.body;

        console.log("Received payment request:", { orderId });

        if (!req.user) {
            console.error("❌ Authentication error: req.user is undefined");
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        console.log("Authenticated User:", req.user);

        // Ensure orderId is a valid UUID
        const orderUUID = typeof orderId === "string" ? orderId : uuidv4(orderId);
        console.log("Converted orderId to UUID:", orderUUID);

        // Find the order
        const order = await Order.findOne({ where: { id: orderUUID, userId: req.user.id } });
        

        if (!order) {
            console.error("❌ Order not found for ID:", orderId);
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("✅ Order found:", order);

        const user = await User.findOne({ where: { id: order.userId } });
        if (!user) {
            console.error("❌ User not found for ID:", order.userId);
            return res.status(404).json({ message: "User not found" });
        }

        const email = user.email;
        console.log("User email:", email);

        // Convert amount to kobo
        const koboAmount = order.totalAmount * 100;
        console.log("Converted amount to kobo:", koboAmount);

        // Paystack request payload
        const paystackData = {
            email,
            amount: koboAmount,
            currency: "NGN",
            reference: `order_${orderId}_${Date.now()}`,
            callback_url: "http://localhost:5000/api/payment/verify",
            metadata: { orderId },
        };

        console.log("🚀 Sending Paystack request with data:", paystackData);

        // Send request to Paystack
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            paystackData,
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );

        console.log("✅ Paystack Response:", response.data);

        // If an authorization code exists, charge the card directly
        if (authorization_code) {
            chargeResponse = await chargeCard(email, koboAmount, authorization_code, orderId);
        }

        res.json({
            authorization_url: response.data.data.authorization_url,
            charge_response: chargeResponse, // Include charge response in the response
        });
    } catch (error) {
        console.error("🔥 Error initializing payment:", error?.response?.data || error.message || error);
        res.status(500).json({
            message: "Payment initialization failed",
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};

// Charge Card Function
const chargeCard = async (email, amount, authorization_code, orderId) => {
    try {
        const reference = `order_${orderId}_${Date.now()}`;
        console.log("🔄 Charging card with reference:", reference);

        const response = await axios.post(
            "https://api.paystack.co/transaction/charge_authorization",
            {
                email,
                amount,
                authorization_code,
                currency: "NGN",
                reference,
            },
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );

        console.log("✅ Charge Response:", response.data)
        return response.data;
    } catch (error) {
        console.error("❌ Payment Error:", error?.response?.data || error.message);
    }
};

// Verify Payment
const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;
        console.log("🔍 Verifying payment for reference:", reference);

        // Extract only the UUID part of the reference
        const orderIdMatch = reference.match(/^order_([a-f0-9-]{36})/);
        if (!orderIdMatch) {
            console.error("❌ Invalid reference format:", reference);
            return res.status(400).json({ message: "Invalid reference format" });
        }

        const orderId = orderIdMatch[1]; // Extracted UUID
        console.log("🆔 Extracted Order ID:", orderId);

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );

        const { status, data } = response.data;
        console.log("✅ Paystack Verification Response:", data);

        if (!status || data.status !== "success") {
            console.error("❌ Payment verification failed:", data);
            return res.status(400).json({ message: "Payment verification failed", data });
        }

        // Find and update the order status
        const order = await Order.findOne({ where: { id: orderId, userId: req.user?.id } });

        if (!order) {
            console.error("❌ Order not found for this payment:", orderId);
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = "confirmed";
        await order.save();

        console.log("✅ Order marked as paid:", order.id);
        res.json({ message: "Payment verified successfully", order });
    } catch (error) {
        console.error("🔥 Error verifying payment:", error?.response?.data || error.message || error);
        res.status(500).json({
            message: "Payment verification failed",
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};






module.exports = { initializePayment, verifyPayment };
