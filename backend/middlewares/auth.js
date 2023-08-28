const jwt = require('jsonwebtoken');

const { JWT_SECRET = '73187cc7ddc9912a3081968e3bf04955957076e69da94fa1d4d7c9234c521885' } = process.env;

const { ErrorUnAuthorization } = require('../errors/errorUnAuthorization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new ErrorUnAuthorization('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new ErrorUnAuthorization('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
