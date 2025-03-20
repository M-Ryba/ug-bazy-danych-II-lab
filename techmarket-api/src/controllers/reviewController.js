const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");
const ReviewDB = require("../models/reviewModel");
const ProductDB = require("../models/productModel");
const UserDB = require("../models/userModel");

// Get all reviews
async function getAllReviews(req, res, next) {
  try {
    const reviews = await ReviewDB.getAll();
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

// Get review by ID
async function getReviewById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const review = await ReviewDB.getById(id);

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
}

// Get reviews by product ID
async function getReviewsByProductId(req, res, next) {
  try {
    const productId = parseInt(req.params.productId);

    // Check if product exists
    const product = await ProductDB.getById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const reviews = await ReviewDB.getByProductId(productId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

// Get reviews by user ID
async function getReviewsByUserId(req, res, next) {
  try {
    const userId = parseInt(req.params.userId);

    // Check if user exists
    const user = await UserDB.getById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const reviews = await ReviewDB.getByUserId(userId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

// Create review
async function createReview(req, res, next) {
  try {
    const newReview = req.body;

    // Validate required fields
    const requiredFields = ["product_id", "user_id", "rating"];
    const missingFields = requiredFields.filter((field) => newReview[field] === undefined);
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate field types and constraints
    if (!Number.isInteger(newReview.product_id) || newReview.product_id <= 0) {
      throw new ValidationError("Product ID must be a positive integer");
    }
    if (!Number.isInteger(newReview.user_id) || newReview.user_id <= 0) {
      throw new ValidationError("User ID must be a positive integer");
    }
    if (!Number.isInteger(newReview.rating) || newReview.rating < 1 || newReview.rating > 5) {
      throw new ValidationError("Rating must be an integer between 1 and 5");
    }
    if (newReview.comment && (typeof newReview.comment !== "string" || newReview.comment.length > 999)) {
      throw new ValidationError("Comment must be a string with maximum length of 999 characters");
    }

    // Check if product and user exist
    const product = await ProductDB.getById(newReview.product_id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const user = await UserDB.getById(newReview.user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if user already reviewed this product
    const existingReview = await ReviewDB.findByUserAndProduct(newReview.user_id, newReview.product_id);
    if (existingReview) {
      throw new DuplicateError("User has already reviewed this product");
    }

    const createdReview = await ReviewDB.create(newReview);

    res.status(201).json({
      message: "Review created successfully",
      review: createdReview,
    });
  } catch (error) {
    next(error);
  }
}

// Update review
async function updateReview(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Find the review to ensure it exists
    const existingReview = await ReviewDB.getById(id);
    if (!existingReview) {
      throw new NotFoundError("Review not found");
    }

    // Validate field types and constraints
    if (updates.rating !== undefined) {
      if (!Number.isInteger(updates.rating) || updates.rating < 1 || updates.rating > 5) {
        throw new ValidationError("Rating must be an integer between 1 and 5");
      }
    }
    if (updates.comment !== undefined && (typeof updates.comment !== "string" || updates.comment.length > 999)) {
      throw new ValidationError("Comment must be a string with maximum length of 999 characters");
    }

    const updatedReview = await ReviewDB.update(id, updates);

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    next(error);
  }
}

// Delete review
async function deleteReview(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deletedReview = await ReviewDB.delete(id);

    if (!deletedReview) {
      throw new NotFoundError("Review not found");
    }

    res.status(200).json({
      message: "Review deleted successfully",
      review: deletedReview,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getReviewsByUserId,
  createReview,
  updateReview,
  deleteReview,
};
