const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = 'movieratingapplicationsecretkey'

const app = express()
const router = express.Router()
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(passport.initialize())

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

app.use(history())
app.use(serveStatic(__dirname + '/dist'))

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})
app.use('/', router)

const port = process.env.API_PORT || 8081
app.listen(port, () => {
  console.log(`api is running on port ${port}`)
})
