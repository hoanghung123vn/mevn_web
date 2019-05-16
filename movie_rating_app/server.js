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

mongoose.connect('mongodb://localhost/movie_rating_app').then(() => {
  console.log('Connection has been made')
}).catch(err => {
  console.error(err, err.stack)
  process.exit(1)
})

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})
app.use('/', router)

const port = process.env.API_PORT || 8081
app.listen(port, () => {
  console.log(`api is running on port ${port}`)
})
