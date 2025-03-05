const { products } = require("../data/products.js");

// Pobieranie wszytkich produktów
function getAllProducts(req, res) {
  res.status(200).json(products);
}

// Pobieranie produktu o podanym id
function getProductById(req, res) {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (product) {
    res.status(404).json({ message: "Product not found" });
  } else {
    res.status(200).json(product);
  }
}

// Tworzenie produktu
function createProduct(req, res) {
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.price) {
    return res.status(400).json({ message: "Name or price not specified!" });
  }

  // Nowe ID (największe ID + 1)
  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
  newProduct.id = maxId + 1;

  // Data utworzenia
  newProduct.createdAt = new Date().toISOString();

  products.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
  });
}

// Aktualizacja produktu
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;

  const productIndex = products.findIndex((p) => p.id === id);

  // Sprawdzenie czy produkt o podanym ID istnieje
  if (productIndex !== -1) {
    updatedProduct.id = id;
    products[productIndex] = updatedProduct;

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Usuwanie produktu
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  // Sprawdzenie czy produkt istnieje
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products[productIndex];
  products = products.filter((p) => p.id !== id);

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
  deleteProduct,
};
