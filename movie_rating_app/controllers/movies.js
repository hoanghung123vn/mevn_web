const MovieModel = require('../models/Movie')
const RatingModel = require('../models/Rating')
const passport = require('passport')

module.exports.controller = (app) => {
  // fetch all movies
  app.get('/movies', (req, res) => {
    MovieModel.find({}, 'name description release_year genre', (error, movies) => {
      if (error) { console.error(error) }
      res.send({ movies })
    })
  })
  // add a movie
  app.post('/movies', (req, res) => {
    const newMovie = new MovieModel({
      name: req.body.name,
      description: req.body.description,
      release_year: req.body.release_year,
      genre: req.body.genre
    })

    newMovie.save((error, movie) => {
      if (error) {
        console.error(error)
      }
      res.send(movie)
    })
  })
  // fetch a single movie by id
  app.get('/api/movies/:id', (req, res) => {
    MovieModel.findById(req.params.id, 'name description release_year genre', (error, movie) => {
      if (error) { console.error(error) }
      res.send(movie)
    })
  })
  // rating a movie
  app.post('/movies/rate/:id', (req, res) => {
    console.log(req.body)
    const rating = new RatingModel({
      user_id: req.body.user_id,
      movie_id: req.params.id,
      rate: req.body.rate
    })

    rating.save((error, movie) => {
      if (error) { console.error(error) }
      res.send({
        user_id: rating.user_id,
        movie_id: rating.movie_id,
        rate: rating.rate
      })
    })
  })
}
