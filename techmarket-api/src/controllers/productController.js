const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");
const ProductDB = require("../models/productModel");
const CategoryDB = require("../models/categoryModel");

// Get all products (GET)
async function getAllProducts(req, res, next) {
  try {
    const { sort, available, minPrice, maxPrice, brand, category, namePattern, category_id } = req.query;

    // Validate sort parameter
    if (sort && !["price_asc", "price_desc"].includes(sort)) {
      throw new ValidationError("Invalid sort parameter. Use 'price_asc' or 'price_desc'");
    }

    // Validate available parameter
    if (available && !["true", "false"].includes(available)) {
      throw new ValidationError("Invalid available parameter. Use 'true' or 'false'");
    }

    // Validate price range
    if (minPrice && isNaN(minPrice)) {
      throw new ValidationError("minPrice must be a number");
    }
    if (maxPrice && isNaN(maxPrice)) {
      throw new ValidationError("maxPrice must be a number");
    }
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      throw new ValidationError("minPrice cannot be greater than maxPrice");
    }

    // Validate namePattern
    if (namePattern && typeof namePattern !== "string") {
      throw new ValidationError("namePattern must be a string");
    }

    // Validate category_id parameter
    if (category_id && (!Number.isInteger(parseInt(category_id)) || parseInt(category_id) <= 0)) {
      throw new ValidationError("category_id must be a positive integer");
    }

    const products = await ProductDB.search({
      sort,
      available,
      minPrice,
      maxPrice,
      brand,
      category,
      namePattern,
      category_id,
    });

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

// Get product with reviews (GET)
async function getProductWithReviews(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const productWithReviews = await ProductDB.getWithReviews(id);

    if (!productWithReviews) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(productWithReviews);
  } catch (error) {
    next(error);
  }
}

// Create product (POST)
async function createProduct(req, res, next) {
  try {
    const newProduct = req.body;

    // Validate required fields
    const requiredFields = ["name", "category", "price", "stock_count", "brand", "is_available"];
    const missingFields = requiredFields.filter((field) => newProduct[field] === undefined);
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate field types and constraints
    if (typeof newProduct.name !== "string" || newProduct.name.length > 50) {
      throw new ValidationError("Name must be a string with maximum length of 50 characters");
    }
    if (typeof newProduct.category !== "string" || newProduct.category.length > 50) {
      throw new ValidationError("Category must be a string with maximum length of 50 characters");
    }
    if (typeof newProduct.price !== "number" || newProduct.price <= 0) {
      throw new ValidationError("Price must be a positive number");
    }
    if (!Number.isInteger(newProduct.stock_count) || newProduct.stock_count < 0) {
      throw new ValidationError("Stock count must be a non-negative integer");
    }
    if (typeof newProduct.brand !== "string" || newProduct.brand.length > 50) {
      throw new ValidationError("Brand must be a string with maximum length of 50 characters");
    }
    if (typeof newProduct.is_available !== "boolean") {
      throw new ValidationError("is_available must be a boolean");
    }
    if (newProduct.description && (typeof newProduct.description !== "string" || newProduct.description.length > 999)) {
      throw new ValidationError("Description must be a string with maximum length of 999 characters");
    }
    if (newProduct.image_url && (typeof newProduct.image_url !== "string" || newProduct.image_url.length > 999)) {
      throw new ValidationError("Image URL must be a string with maximum length of 999 characters");
    }

    // Validate category_id if provided
    if (newProduct.category_id !== undefined) {
      if (!Number.isInteger(newProduct.category_id) || newProduct.category_id <= 0) {
        throw new ValidationError("category_id must be a positive integer");
      }

      // Check if category exists
      const category = await CategoryDB.getById(newProduct.category_id);
      if (!category) {
        throw new ValidationError(`Category with ID ${newProduct.category_id} does not exist`);
      }
    }

    const existingProduct = await ProductDB.search({ name: newProduct.name });
    if (existingProduct) {
      throw new DuplicateError(`Product with name '${newProduct.name}' already exists`);
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

    // Validate field types and constraints if they are being updated
    if (updates.name !== undefined && (typeof updates.name !== "string" || updates.name.length > 50)) {
      throw new ValidationError("Name must be a string with maximum length of 50 characters");
    }
    if (updates.category !== undefined && (typeof updates.category !== "string" || updates.category.length > 50)) {
      throw new ValidationError("Category must be a string with maximum length of 50 characters");
    }
    if (updates.price !== undefined && (typeof updates.price !== "number" || updates.price <= 0)) {
      throw new ValidationError("Price must be a positive number");
    }
    if (updates.stock_count !== undefined && (!Number.isInteger(updates.stock_count) || updates.stock_count < 0)) {
      throw new ValidationError("Stock count must be a non-negative integer");
    }
    if (updates.brand !== undefined && (typeof updates.brand !== "string" || updates.brand.length > 50)) {
      throw new ValidationError("Brand must be a string with maximum length of 50 characters");
    }
    if (updates.is_available !== undefined && typeof updates.is_available !== "boolean") {
      throw new ValidationError("is_available must be a boolean");
    }
    if (updates.description !== undefined && (typeof updates.description !== "string" || updates.description.length > 999)) {
      throw new ValidationError("Description must be a string with maximum length of 999 characters");
    }
    if (updates.image_url !== undefined && (typeof updates.image_url !== "string" || updates.image_url.length > 999)) {
      throw new ValidationError("Image URL must be a string with maximum length of 999 characters");
    }

    // Validate category_id if provided
    if (updates.category_id !== undefined) {
      if (!Number.isInteger(updates.category_id) || updates.category_id <= 0) {
        throw new ValidationError("category_id must be a positive integer");
      }

      // Check if category exists
      const category = await CategoryDB.getById(updates.category_id);
      if (!category) {
        throw new ValidationError(`Category with ID ${updates.category_id} does not exist`);
      }
    }

    if (updates.name) {
      const existingProduct = await ProductDB.search({ name: updates.name });
      if (existingProduct && existingProduct.product_id !== id) {
        throw new DuplicateError(`Product with name '${updates.name}' already exists`);
      }
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
  getProductWithReviews,
  createProduct,
  updateProduct,
  deleteProduct,
};
