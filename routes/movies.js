const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string().uri(),
    trailerLink: Joi.string().uri(),
    thumbnail: Joi.string().uri(),
    owner: Joi.string(),
    movieId: Joi.number(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
  }).unknown(true),
}), createMovie);

movieRouter.delete('/_id', celebrate({
//  params: Joi.object().keys({
//    _id: Joi.string(),
//  }).unknown(true),
}), deleteMovie);

module.exports = movieRouter;
