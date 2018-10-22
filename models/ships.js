const mongoose = require('mongoose');

const shipsSchema = new mongoose.Schema({
  name: String,
  speedInKmHr: Number,
  capacity: Number, 
  captain: String,
  flightAttendants: [String]

});

module.exports = mongoose.model('Ship', shipsSchema);