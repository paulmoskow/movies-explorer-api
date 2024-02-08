const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
    director: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле обязательно к заполнению'],
    },
    year: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
    description: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
    image: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка',
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    movieId: {
      type: Number,
      required: [true, 'Поле обязательно к заполнению'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
    nameEN: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
