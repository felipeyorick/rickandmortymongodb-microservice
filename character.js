const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
  species: String,
  gender: String,
  origin: { name: String },
  location: { name: String },
  image: String
});

module.exports = mongoose.model('character', characterSchema);