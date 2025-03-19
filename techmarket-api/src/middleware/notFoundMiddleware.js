// Middleware obsługujące nieznalezione ścieżki (404 Not Found)
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Resource not found: ${req.originalUrl}`,
  });
};

module.exports = notFoundHandler;
