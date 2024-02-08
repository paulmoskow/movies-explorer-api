const jwt = require('jsonwebtoken');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  const token = authorization.split('Bearer ')[1];
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  req.user = payload;

  next();
};
