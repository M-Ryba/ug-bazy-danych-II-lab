const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products - download all products
router.get("/", productController.getAllProducts);

// GET /api/products/:id - download product by ID
router.get("/:id", productController.getProductById);

// GET /api/products/:id/reviews - get product with its reviews
router.get("/:id/reviews", productController.getProductWithReviews);

// POST /api/products - add new product
router.post("/", productController.createProduct);

// PATCH /api/products/:id - update product
router.patch("/:id", productController.updateProduct);

// DELETE /api/products/:id - delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
