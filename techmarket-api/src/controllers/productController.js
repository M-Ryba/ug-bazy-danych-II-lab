const { ValidationError, NotFoundError } = require("../utils/errors");
const ProductDB = require("../models/productModel");

// Get all products (GET)
async function getAllProducts(req, res, next) {
  try {
    const products = await ProductDB.getAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

// Get product by ID (GET)
async function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductDB.getById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

// Create product (POST)
function createProduct(req, res, next) {
  try {
    const newProduct = req.body;

    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      throw new ValidationError("Name, price or category not specified");
    }

    // Validate price is a positive number
    if (typeof newProduct.price !== "number" || newProduct.price <= 0) {
      throw new ValidationError("Price must be a positive number");
    }

    // New ID (biggest ID + 1)
    const maxId = products.reduce(
      (max, product) => Math.max(max, product.id),
      0
    );
    newProduct.id = maxId + 1;

    // Creation date
    newProduct.createdAt = new Date().toISOString();

    products.push(newProduct);

    res.status(200).json({
      message: "Product updated successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
}

// Update product (PATCH)
const patchProduct = (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;

    if (
      updates.price !== undefined &&
      (typeof updates.price !== "number" || updates.price <= 0)
    ) {
      throw new ValidationError("Price must be a positive number");
    }

    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      throw new NotFoundError("Product not found");
    }

    // Only update specified properties
    const updatedProduct = {
      ...products[productIndex],
      ...updates,
      id: products[productIndex].id, // Preserve original ID
    };

    products[productIndex] = updatedProduct;

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (DELETE)
const deleteProduct = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundError("Product not found");
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
};
