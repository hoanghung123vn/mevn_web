const mongoose = require('mongoose')

const Schema = mongoose.Schema
const MovieSchema = new Schema({
  name: String,
  decription: String,
  release_year: Number,
  genre: String
})

const Movie = mongoose.model('Movie', MovieSchema)
module.exports = Movie
