const MovieModel = require('../models/Movie')
module.exports.controller = (app) => {
  // fetch all movies
  app.get('/movies', (req, res) => {
    MovieModel.find({}, 'name description release_year genre', (error, movies) => {
      if (error) { console.log(error) }
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
        console.log(error)
      }
      res.send(movie)
    })
  })
}
