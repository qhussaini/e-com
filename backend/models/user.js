const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required:true, unique: true },
  shopName: { type: String, required:true },
  shopNumber: { type: String, required:false, unique: true },
  password: { type: String, required:true },
  userType: { type: String, required:true },
  userName: { type: String, required:true },
  address: { type: Object},
  userTheme: { type: Boolean},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
