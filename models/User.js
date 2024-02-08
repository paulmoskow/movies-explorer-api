const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле обязательно к заполнению'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      select: false,
    },
    name: {
      type: String,
      default: 'Your name',
      minlength: [2, 'Минимальная длина - 2 символа'],
      required: [true, 'Поле обязательно к заполнению'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
  },
  { versionKey: false, timestamps: true },
);

// check users email and password
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedAccess('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedAccess('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
