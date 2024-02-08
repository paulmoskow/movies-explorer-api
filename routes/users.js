const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserProfile,
  getUserData,
} = require('../controllers/users');

userRouter.get('/me', getUserData);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }).unknown(true),
}), updateUserProfile);

module.exports = userRouter;
