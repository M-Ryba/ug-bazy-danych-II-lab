const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// GET /api/reviews - get all reviews
router.get("/", reviewController.getAllReviews);

// GET /api/reviews/:id - get review by ID
router.get("/:id", reviewController.getReviewById);

// GET /api/reviews/product/:productId - get reviews for a specific product
router.get("/product/:productId", reviewController.getReviewsByProductId);

// GET /api/reviews/user/:userId - get reviews by a specific user
router.get("/user/:userId", reviewController.getReviewsByUserId);

// POST /api/reviews - create a new review
router.post("/", reviewController.createReview);

// PATCH /api/reviews/:id - update a review
router.patch("/:id", reviewController.updateReview);

// DELETE /api/reviews/:id - delete a review
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
