const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')
const session = require('express-session')
const config = require('./config/Config')
const passport = require('passport')

const app = express()
const router = express.Router()
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(session({
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false }
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(config.DB, () => {
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

router.get('/api/current_user', isLoggedIn, (req, res) => {
  if (req.user) {
    res.send({ current_user: req.user })
  } else {
    res.send({ success: false, msg: 'Unauthorized' })
  }
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated) return next()
  res.redirect('/')
  console.log('Error, auth failed!')
}

router.get('/api/logout', (req, res) => {
  req.logout()
  res.send()
})

router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})
app.use('/', router)

const port = process.env.API_PORT || 8081
app.listen(port, () => {
  console.log(`api is running on port ${port}`)
})
