const { Product } = require("../models/product");
const OrderItem = require("../models/orderItem");

// 📌 Create a New Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity } = req.body;
    const product = await Product.create({ name, description, price, stockQuantity });

    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get All Products (with Pagination & Filtering)
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const whereCondition = status ? { status } : {}; // Filter by stock status if provided
    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ total: count, page, limit, products: rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get a Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Update Product Details
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ name, description, price, stockQuantity });
    return res.json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Delete a Product (Only if NOT linked to an Order)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product is in an active order
    const orderItemExists = await OrderItem.findOne({ where: { productId } });
    if (orderItemExists) {
      return res.status(400).json({ error: "Cannot delete product linked to an order" });
    }

    // Delete the product
    const deleted = await Product.destroy({ where: { id: productId } });
    if (!deleted) return res.status(404).json({ error: "Product not found" });

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get Low Stock Products (Stock < 5)
exports.getLowStockProducts = async (req, res) => {
    try {
      const lowStockProducts = await Product.findAll({
        where: {
          stockQuantity: { [Op.lt]: 5 }
        },
        order: [["stockQuantity", "ASC"]]
      });
  
      return res.json({ lowStockProducts });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  