const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  product: { type: Object, required:true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  creatorName: { type: String, ref: "User", required: true},
  creatorShop: { type: String, ref: "User", required: true},
  orderStatus: { type: String, required: true},
  address: { type: Object, required: true},
});

module.exports = mongoose.model('Order', orderSchema);
