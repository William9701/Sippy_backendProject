const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this points to your database connection
const  User  = require("./user");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    orderType: {
        type: DataTypes.ENUM("single", "group"),
        allowNull: false,
    },
    items: {
        type: DataTypes.JSONB, // Stores an array of ordered items
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        defaultValue: "pending",
    },
}, {
    timestamps: true,
});

module.exports = { Order };
