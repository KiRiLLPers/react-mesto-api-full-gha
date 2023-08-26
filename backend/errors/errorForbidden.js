class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 403;
  }
}

module.exports = {
  ErrorForbidden,
};
