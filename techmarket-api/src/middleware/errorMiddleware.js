const { ValidationError, NotFoundError, DuplicateError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message,
    });
  }

  if (err instanceof DuplicateError) {
    return res.status(409).json({
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
  });
};

module.exports = errorHandler;
