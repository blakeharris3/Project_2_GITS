const mongoose = require('mongoose');

const shipsSchema = new mongoose.Schema({
  name: String,

});

module.exports = mongoose.model('Ship', shipsSchema);