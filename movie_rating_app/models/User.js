const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String
})

const User = mongoose.model('User', UserSchema)
module.exports = User

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (_error, salt) => {
    bcrypt.hash(newUser.password, salt, (_error, hash) => {
      // store the hash password
      const newUserResource = newUser
      newUserResource.password = hash
      newUserResource.save(callback)
    })
  })
}

module.exports.getUserByEmail = (email, callback) => {
  const query = { email }
  User.findOne(query, callback)
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (error, isMatch) => {
    if (error) throw error
    callback(null, isMatch)
  })
}
