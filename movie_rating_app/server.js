const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')

const app = express()
const router = express.Router()
app.use(morgan('combined'))
app.use(bodyParse.json())
app.use(cors())

mongoose.connect('mongodb://localhost/movie_rating_app', () => {
  console.log('Connected')
}).catch(err => {
  console.error('App starting error', err.stack)
  process.exit(1)
})

// Include controllers
fs.readdirSync('controllers').forEach(file => {
  if (file.substr(-3) === '.js') {
    const route = require('./controllers/' + file)
    route.controller(app)
  }
})

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})
app.use('/', router)

const port = process.env.API_PORT || 8081
app.listen(port, () => {
  console.log(`api is running on port ${port}`)
})
