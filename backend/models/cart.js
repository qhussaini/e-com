const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  product: { type: Object, required:true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Cart', cartSchema);

// // const mongoose = require('mongoose');

// // const cartSchema = mongoose.Schema({
// //   dateCreated: { type: String, required:true },
// //   items: { type: Object, required: false},
// // });

// // module.exports = mongoose.model('Cart', cartSchema);

// module.exports = function Cart(oldCart) {
//   this.items = oldCart.items;
//   this.totalQty = oldCart.totalQty;
//   this.totalPrice = oldCart.totalPrice

//   this.add = function(item, id) {
//     var storedItem = this.items[id];
//     if (!storedItem) {
//       storedItem = this.item[id] = {item: item, qty: 0, price: 0};
//     }
//     storedItem.qty++
//     storedItem.price = storedItem.item.price * storedItem.qty;
//     this.totalQty++
//     this.totalPrice += storedItem.price;
//   };

//   this.generateArray = function() {
//     var arr = [];
//     for (var id in this.items) {
//       arr.push(this.items[id])
//     }
//     return arr
//   }
// }
