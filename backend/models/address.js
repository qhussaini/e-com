const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  name: { type: String, required:true },
  addressLine1: { type: String, ref: "User", required: true},
  addressLine2: { type: String, ref: "User", required: false},
  city: { type: String, ref: "User", required: true},
  pincode: { type: Number, required: true},
  country: { type: String, ref: "User", required: true},
  phone: { type: Number, required: true},
});

module.exports = mongoose.model('Address', addressSchema);
