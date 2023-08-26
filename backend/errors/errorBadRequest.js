class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 400;
  }
}

module.exports = {
  ErrorBadRequest,
};
