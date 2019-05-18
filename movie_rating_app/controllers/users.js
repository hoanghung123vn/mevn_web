const UserModel = require('../models/User')
const passport = require('passport')
const passportLocal = require('passport-local')

const LocalStrategy = passportLocal.Strategy

module.exports.controller = (app) => {
  // local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    UserModel.getUserByEmail(email, (error, user) => {
      if (error) return done(error)
      if (!user) return done(null, false)
      UserModel.comparePassword(password, user.password, (_error, isMatch) => {
        if (isMatch) return done(null, user)
        return done(null, false)
      })
      return true
    })
  }))

  // register a user
  app.post('/users/register', (req, res) => {
    const { name, email, password } = req.body
    const newUser = new UserModel({
      name, email, password
    })
    UserModel.createUser(newUser, (error, user) => {
      if (error) {
        res.status(422).json({ message: 'Something went wrong, please try again after some time!' })
      }
      res.send({ user })
    })
  })
  // login a user
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
    res.redirect('/')
  })
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (error, user) => {
      done(error, user)
    })
  })
}
