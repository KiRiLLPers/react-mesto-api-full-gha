const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'my-secreet';
const SALT_ROUND = 10;
module.exports = {
  SALT_ROUND,
  JWT_SECRET,
};
