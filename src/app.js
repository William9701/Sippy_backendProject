const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/database");
const authRouters = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow external connections if needed
    }
});

// Make io accessible throughout the app
app.set("io", io);

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


// WebSocket connection handling
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("trackOrder", (orderId) => {
        console.log(`Client tracking order: ${orderId}`);
        socket.join(orderId); // Join a room for the specific order
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


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