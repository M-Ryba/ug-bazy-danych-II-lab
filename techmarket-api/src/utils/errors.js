class ValidationError extends Error {
  constructor(message = "Data validation error") {
    super(message);
  }
}

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
};
