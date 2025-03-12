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
async function createProduct(req, res, next) {
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

    const createdProduct = await ProductDB.create(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
}

// Update product (PATCH)
async function updateProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    if (
      updates.price !== undefined &&
      (typeof updates.price !== "number" || updates.price <= 0)
    ) {
      throw new ValidationError("Price must be a positive number");
    }

    const updatedProduct = await ProductDB.update(id, updates);

    if (!updatedProduct) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

// Delete product (DELETE)
async function deleteProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deletedProduct = await ProductDB.delete(id);

    if (!deletedProduct) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
