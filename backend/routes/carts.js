const express = require("express");

const Cart = require("../models/cart");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  console.log(req.body.productId);
  const cart = new Cart({
    product: req.body.productId,
    creator: req.userData.userId
  });
  cart.save().then(cart => {
    res.status(201).json({
      message: "cart add successfully",
      cart:cart
    })
  })
});

router.get("", checkAuth, (req, res, next) => {
  Cart.find().then(document => {
    console.log(document)
    res.status(200).json({
      message: "Cart fetched succesfully!",
      cart: document
    });
  });
})

module.exports = router;
