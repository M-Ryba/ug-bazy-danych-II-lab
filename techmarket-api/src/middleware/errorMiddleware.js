const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err instanceof DuplicateError) {
    return res.status(409).json({
      message: err.message,
    });
  }

  // Database unique violation
  if (err.code === "23505") {
    return res.status(409).json({
      message: "A product with this name already exists",
    });
  }

  // Default error
  console.error(err); // Log the error for debugging
  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;
