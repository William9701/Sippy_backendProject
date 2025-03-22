const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/database");
const authRouters = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
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


// test Routes
app.get("/", (req, res) => {
    res.send("🚀 Beverage API is running...")
})

// sync database
sequelize.sync({ force: false })
    .then(() => console.log("✅ Database synced..."))
    .catch(err => console.error("❌ Unable to sync database:", err));

module.exports = app;