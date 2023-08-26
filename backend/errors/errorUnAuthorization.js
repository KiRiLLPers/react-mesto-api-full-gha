class ErrorUnAuthorization extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 401;
  }
}

module.exports = {
  ErrorUnAuthorization,
};
