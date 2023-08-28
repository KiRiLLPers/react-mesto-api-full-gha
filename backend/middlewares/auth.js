const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'my-secret-key' } = require('../consts/consts');
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
