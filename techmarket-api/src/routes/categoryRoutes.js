const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET /api/categories - get all categories
router.get("/", categoryController.getAllCategories);

// GET /api/categories/:id - get category by ID
router.get("/:id", categoryController.getCategoryById);

// GET /api/categories/:id/products - get category with its products
router.get("/:id/products", categoryController.getCategoryWithProducts);

// POST /api/categories - create new category
router.post("/", categoryController.createCategory);

// PATCH /api/categories/:id - update category
router.patch("/:id", categoryController.updateCategory);

// DELETE /api/categories/:id - delete category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
