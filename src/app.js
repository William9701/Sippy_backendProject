const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/database");
const authRouters = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use("/api/auth", authRouters);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);



// test Routes
app.get("/", (req, res) => {
    res.send("🚀 Beverage API is running...")
})

app.post("/api/payment/webhook", express.json(), async (req, res) => {
    const { event, data } = req.body;

    if (event === "charge.success") {
        const orderId = data.metadata?.orderId;

        if (orderId) {
            await Order.update(
                { status: "paid" },
                { where: { id: orderId } }
            );
        }
    }

    res.sendStatus(200);
});


// sync database
sequelize.sync({ force: false })
    .then(() => console.log("✅ Database synced..."))
    .catch(err => console.error("❌ Unable to sync database:", err));

module.exports = app;