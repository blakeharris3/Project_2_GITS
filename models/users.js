const mongoose = require('mongoose');
const Trip = require('./trips')
const uniqueValidator = require('mongoose-unique-validator')

const usersSchema = new mongoose.Schema({
  name: String,
  username: {type: String}, 
  email: {type: String},
  password: {type: String},
  trips: [Trip.schema],
  currentDestination: String,
  googleId: String,
  githubId: String
});

usersSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', usersSchema);