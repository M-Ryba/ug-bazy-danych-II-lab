const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /api/users - get all users
router.get("/", userController.getAllUsers);

// GET /api/users/:id - get user by ID
router.get("/:id", userController.getUserById);

// GET /api/users/:id/reviews - get user with their reviews
router.get("/:id/reviews", userController.getUserWithReviews);

// POST /api/users - create new user
router.post("/", userController.createUser);

// PATCH /api/users/:id - update user
router.patch("/:id", userController.updateUser);

// DELETE /api/users/:id - delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
