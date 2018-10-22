const mongoose = require('mongoose');
const Trip = require('./trips')
const uniqueValidator = require('mongoose-unique-validator')

const usersSchema = new mongoose.Schema({
  name: String,
  username: {type: String, required: true, unique: true }, 
  email: {type: String , required: true, unique: true },
  password: {type: String, required: true},
  trips: [trips.schema],
  curentTrip: Number
});

usersSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', usersSchema);