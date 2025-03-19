class ValidationError extends Error {
  constructor(message = "Data validation error has occurred") {
    super(message);
  }
}

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
  }
}

class DuplicateError extends Error {
  constructor(message = "Resource already exists") {
    super(message);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  DuplicateError,
};
