const { ValidationError, NotFoundError } = require("../utils/errors");

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
  // Default error
  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;
