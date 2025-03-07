const { products } = require("../data/products.js");
const { ValidationError, NotFoundError } = require("../utils/errors");

// Get all products
function getAllProducts(req, res, next) {
  try {
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

// Get product by ID
function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

// Create product
function createProduct(req, res, next) {
  try {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      throw new ValidationError("Name, price or category not specified");
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

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
}

// Update whole product (PUT)
const updateProduct = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundError("Product not found");
    }

    // Ignore id given in JSON body
    updatedProduct.id = products[productIndex].id;
    products[productIndex] = updatedProduct;

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const patchProduct = (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;
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

// Delete product
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
  updateProduct,
  patchProduct,
  deleteProduct,
};
