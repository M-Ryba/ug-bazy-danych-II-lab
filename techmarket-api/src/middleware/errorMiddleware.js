const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Known error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Data validation error has ocurred!",
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    message: "Server-side error has occured!",
    error: err.message,
  });
};

module.exports = errorMiddleware;
