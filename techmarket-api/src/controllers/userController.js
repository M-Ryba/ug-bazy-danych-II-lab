const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");
const UserDB = require("../models/userModel");

// Get all users
async function getAllUsers(req, res, next) {
  try {
    const users = await UserDB.getAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

// Get user by ID
async function getUserById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const user = await UserDB.getById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// Get user with reviews
async function getUserWithReviews(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const userWithReviews = await UserDB.getWithReviews(id);

    if (!userWithReviews) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(userWithReviews);
  } catch (error) {
    next(error);
  }
}

// Create user
async function createUser(req, res, next) {
  try {
    const newUser = req.body;

    // Validate required fields
    const requiredFields = ["username", "email", "password_hash"];
    const missingFields = requiredFields.filter((field) => newUser[field] === undefined);
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate field types and constraints
    if (typeof newUser.username !== "string" || newUser.username.length > 50) {
      throw new ValidationError("Username must be a string with maximum length of 50 characters");
    }
    if (typeof newUser.email !== "string" || newUser.email.length > 100) {
      throw new ValidationError("Email must be a string with maximum length of 100 characters");
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      throw new ValidationError("Invalid email format");
    }
    if (typeof newUser.password_hash !== "string" || newUser.password_hash.length > 255) {
      throw new ValidationError("Password hash must be a string with maximum length of 255 characters");
    }
    if (newUser.first_name && (typeof newUser.first_name !== "string" || newUser.first_name.length > 50)) {
      throw new ValidationError("First name must be a string with maximum length of 50 characters");
    }
    if (newUser.last_name && (typeof newUser.last_name !== "string" || newUser.last_name.length > 50)) {
      throw new ValidationError("Last name must be a string with maximum length of 50 characters");
    }

    // Check for duplicate username and email
    const existingUsername = await UserDB.findByUsername(newUser.username);
    if (existingUsername) {
      throw new DuplicateError(`User with username '${newUser.username}' already exists`);
    }

    const existingEmail = await UserDB.findByEmail(newUser.email);
    if (existingEmail) {
      throw new DuplicateError(`User with email '${newUser.email}' already exists`);
    }

    const createdUser = await UserDB.create(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
}

// Update user
async function updateUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Validate field types and constraints
    if (updates.username !== undefined && (typeof updates.username !== "string" || updates.username.length > 50)) {
      throw new ValidationError("Username must be a string with maximum length of 50 characters");
    }
    if (updates.email !== undefined) {
      if (typeof updates.email !== "string" || updates.email.length > 100) {
        throw new ValidationError("Email must be a string with maximum length of 100 characters");
      }
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new ValidationError("Invalid email format");
      }
    }
    if (updates.password_hash !== undefined && (typeof updates.password_hash !== "string" || updates.password_hash.length > 255)) {
      throw new ValidationError("Password hash must be a string with maximum length of 255 characters");
    }
    if (updates.first_name !== undefined && (typeof updates.first_name !== "string" || updates.first_name.length > 50)) {
      throw new ValidationError("First name must be a string with maximum length of 50 characters");
    }
    if (updates.last_name !== undefined && (typeof updates.last_name !== "string" || updates.last_name.length > 50)) {
      throw new ValidationError("Last name must be a string with maximum length of 50 characters");
    }

    // Check for duplicate username or email
    if (updates.username) {
      const existingUsername = await UserDB.findByUsername(updates.username);
      if (existingUsername && existingUsername.user_id !== id) {
        throw new DuplicateError(`User with username '${updates.username}' already exists`);
      }
    }

    if (updates.email) {
      const existingEmail = await UserDB.findByEmail(updates.email);
      if (existingEmail && existingEmail.user_id !== id) {
        throw new DuplicateError(`User with email '${updates.email}' already exists`);
      }
    }

    const updatedUser = await UserDB.update(id, updates);

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// Delete user
async function deleteUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deletedUser = await UserDB.delete(id);

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserWithReviews,
  createUser,
  updateUser,
  deleteUser,
};
