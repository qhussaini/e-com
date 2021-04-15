const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  itemName:{ type: String, required:true },
  itemCategory: { type: String, required:true },
  itemMRP:{ type: Number, required:true },
  itemImgUrl:{ type: String, required:true },
  itemFlavors:{ type: String, required:true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
});

module.exports = mongoose.model('Product', productSchema);
