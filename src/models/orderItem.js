const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Order } = require("./order");
const { Product } = require("./product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    tableName: "OrderItems",
  }
);

// Relationships
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = OrderItem;
