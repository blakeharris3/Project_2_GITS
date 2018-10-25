const mongoose = require('mongoose');
const Destination = require('./destinations')

const tripsSchema = new mongoose.Schema({
  name: String,
  fromDestination: [Destination.schema],
  toDestination: [Destination.schema],
  ticketQty: Number, 
  luggageQty: Number
});

module.exports = mongoose.model('Trip', tripsSchema);