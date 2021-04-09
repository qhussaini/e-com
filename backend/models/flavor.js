const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
  flavor:{ type: String, required:true }
});

module.exports = mongoose.model('Flavor', flavorSchema);
