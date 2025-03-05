const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products - download all products
router.get("/", productController.getAllProducts);

// GET /api/products/:id - download product by ID
router.get("/:id", productController.getProductById);

// POST /api/products - add new product
router.post("/", productController.createProduct);

// PUT /api/products/:id - update product
router.put("/:id", productController.updateProduct);

// PATCH /api/products/:id - partially update product
router.patch("/:id", productController.patchProduct);

// DELETE /api/products/:id - delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
