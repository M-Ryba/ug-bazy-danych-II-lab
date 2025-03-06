const { products } = require("../data/products.js");

// Get all products
function getAllProducts(req, res) {
  res.status(200).json(products);
}

// Get product by ID
function getProductById(req, res) {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
  } else {
    res.status(200).json(product);
  }
}

// Create product
function createProduct(req, res, next) {
  try {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      res
        .status(400)
        .json({ message: "Name, price or category not specified!" });
      const error = new Error("Name, price or category not specified!");
      error.name = "ValidationError";
      throw error;
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
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;

  const productIndex = products.findIndex((p) => p.id === id);

  // Check if product with given id exists
  if (productIndex !== -1) {
    // Ignore id given in JSON body
    updatedProduct.id = products[productIndex].id;
    products[productIndex] = updatedProduct;

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const patchProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const updates = req.body;

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
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
};

// Delete product
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  // Check if product exists
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
