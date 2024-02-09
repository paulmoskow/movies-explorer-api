const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const Conflict = require('../errors/conflict');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

const { NODE_ENV, JWT_SECRET } = process.env;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;
const UNAUTHORIZED_ACCESS = 401;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      return res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new Conflict('Такой пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.code === UNAUTHORIZED_ACCESS) {
        next(new UnauthorizedAccess('Необходима авторизация'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserData = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new Conflict('Такой пользователь уже зарегистрирован'));
      }
      return next(err);
    });
};
