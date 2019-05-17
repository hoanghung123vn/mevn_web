const UserModel = require('../models/User')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = 'thisisthesecretkey'

module.exports.controller = (app) => {
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
  app.post('/users/login', (req, res) => {
    const { email, password } = req.body
    if (email && password) {
      UserModel.getUserByEmail(email, (_error, user) => {
        if (!user) {
          res.status(404).json({ message: 'The user is not exist!' })
        } else {
          UserModel.comparePassword(password, user.password, (error, isMatch) => {
            if (error) throw error
            if (isMatch) {
              const payload = { id: user.id }
              const token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({ message: 'ok', token })
            } else {
              res.status(401).json({ message: 'The password is incorect!' })
            }
          })
        }
      })
    }
  })
}
