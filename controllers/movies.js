const Movie = require('../models/Movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new ValidationError('Переданы некорректные данные при сохранении фильма');
      }
      return res.status(201).send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не можете удалить этот фильм');
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => {
          if (!movie) {
            throw new NotFoundError('Фильм не найден');
          }
          return res.status(200).send(movie);
        });
    })
    .catch(next);
};
