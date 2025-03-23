const { Order } = require("../models/order");
const { Product } = require("../models/product");
const sequelize = require("../config/database");
const  User  = require("../models/user");
const Joi = require("joi");

// Order validation schema
const orderSchema = Joi.object({
    orderType: Joi.string().valid("single", "group").required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().uuid().required(),
            name: Joi.string().optional(),
            quantity: Joi.number().min(1).required(),
        })
    ).required(),
});

// Create Order
const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start transaction

    try {
        const { error } = orderSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { orderType, items } = req.body;
        const userId = req.user.id; // Assuming user is authenticated via middleware

        let totalAmount = 0;
        let processedItems = [];

        // Check stock availability and get product price
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });

            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }

            if (product.stockQuantity < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
                });
            }

            const itemPrice = product.price;
            totalAmount += item.quantity * itemPrice;

            processedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        // Create order
        const order = await Order.create(
            { userId, orderType, items: processedItems, totalAmount },
            { transaction }
        );

        // Reduce stock levels
        for (const item of processedItems) {
            const product = await Product.findByPk(item.productId, { transaction });

            product.stockQuantity -= item.quantity;
            await product.save({ transaction });
        }

        await transaction.commit(); // Commit transaction

        return res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        await transaction.rollback(); // Rollback transaction on error
        console.error("Order Creation Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all orders for a user
const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });

        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ where: { id, userId } });
        if (!order) return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({ order });

    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Order (Only if it's still pending)
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { orderType, items } = req.body;

        const order = await Order.findOne({ where: { id, userId } });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Only pending orders can be updated" });
        }

        const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        await order.update({ orderType, items, totalAmount });

        return res.status(200).json({ message: "Order updated successfully", order });

    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ where: { id, userId } });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }

        await order.update({ status: "cancelled" });

        return res.status(200).json({ message: "Order cancelled successfully" });

    } catch (error) {
        console.error("Error cancelling order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
};
