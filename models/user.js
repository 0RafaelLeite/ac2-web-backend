const mongoose = require('mongoose')

const UserModel = mongoose.model('users', {
    name: String,
    email: String,
    role: String,
    password: String
})

module.exports = UserModel