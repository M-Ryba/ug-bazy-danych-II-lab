const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");
const CategoryDB = require("../models/categoryModel");
const ProductDB = require("../models/productModel");

// Get all categories
async function getAllCategories(req, res, next) {
  try {
    const categories = await CategoryDB.getAll();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

// Get category by ID
async function getCategoryById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const category = await CategoryDB.getById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

// Get category with products
async function getCategoryWithProducts(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const categoryWithProducts = await CategoryDB.getWithProducts(id);

    if (!categoryWithProducts) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(categoryWithProducts);
  } catch (error) {
    next(error);
  }
}

// Create category
async function createCategory(req, res, next) {
  try {
    const newCategory = req.body;

    // Validate required fields
    if (!newCategory.name) {
      throw new ValidationError("Category name is required");
    }

    // Validate field types and constraints
    if (typeof newCategory.name !== "string" || newCategory.name.length > 50) {
      throw new ValidationError("Name must be a string with maximum length of 50 characters");
    }
    if (newCategory.description && (typeof newCategory.description !== "string" || newCategory.description.length > 255)) {
      throw new ValidationError("Description must be a string with maximum length of 255 characters");
    }

    // Check for duplicate category name
    const existingCategory = await CategoryDB.findByName(newCategory.name);
    if (existingCategory) {
      throw new DuplicateError(`Category with name '${newCategory.name}' already exists`);
    }

    const createdCategory = await CategoryDB.create(newCategory);

    res.status(201).json({
      message: "Category created successfully",
      category: createdCategory,
    });
  } catch (error) {
    next(error);
  }
}

// Update category
async function updateCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Validate field types and constraints if they are being updated
    if (updates.name !== undefined && (typeof updates.name !== "string" || updates.name.length > 50)) {
      throw new ValidationError("Name must be a string with maximum length of 50 characters");
    }
    if (updates.description !== undefined && (typeof updates.description !== "string" || updates.description.length > 255)) {
      throw new ValidationError("Description must be a string with maximum length of 255 characters");
    }

    // Check for duplicate category name
    if (updates.name) {
      const existingCategory = await CategoryDB.findByName(updates.name);
      if (existingCategory && existingCategory.category_id !== id) {
        throw new DuplicateError(`Category with name '${updates.name}' already exists`);
      }
    }

    const updatedCategory = await CategoryDB.update(id, updates);

    if (!updatedCategory) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
}

// Delete category
async function deleteCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    // Check if category has products
    const products = await ProductDB.getByCategory(id);
    if (products.length > 0) {
      throw new ValidationError("Cannot delete category with associated products");
    }

    const deletedCategory = await CategoryDB.delete(id);

    if (!deletedCategory) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryWithProducts,
  createCategory,
  updateCategory,
  deleteCategory,
};
