const express = require("express");

const Cart = require("../models/cart");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/create", checkAuth, (req, res, next) => {
  const cart = new Cart({
    product: req.body.productId,
    creatorId: req.userData.userId,
    creatorName: req.userData.userName,
    creatorShop: req.userData.shopName
  });
  cart.save().then(cart => {
    res.status(201).json({
      message: "cart add successfully",
      cart:cart
    })
  }).catch( err => {
    res.status(500).json({
      message: "Not authorized!"
    })
  })
});

// router.get("", checkAuth, (req, res, next) => {
//   Cart.find().then(document => {
//     res.status(200).json({
//       message: "Cart fetched succesfully!",
//       cart: document
//     });
//   });
// })

router.get("", checkAuth, (req, res, next) => {
  Cart.findOne({creatorId: req.userData.userId}).then(document => {
    res.status(200).json({
      message: "Cart fetched succesfully!",
      cart: document
    })
  });
})

router.get("/order/:orderId", checkAuth, (req, res, next) => {
  Cart.findOne({_id: req.params.orderId}).then(document => {
    console.log(document)
    res.status(200).json({
      message: "order fetched succesfully!",
      order: document
    });
  });
})

router.put("/update/:cartId", checkAuth, (req, res, next) => {
  const cart = {
    product: req.body.productId,
    creatorId: req.userData.userId,
    creatorName: req.userData.userName,
    creatorShop: req.userData.shopName
  };
  console.log(cart);
  Cart.updateOne({_id: req.params.cartId}, cart ).then(document => {
    if(document.n > 0){
      res.status(200).json({
         message: "Update Successful!",
         cart: document,
      });
    }else {
      res.status(401).json({
         message: "Not authorized To update this Order!",
      });
    }
  });
})

router.delete("/myCart/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id)
  Cart.deleteOne({ _id: req.params.id, creatorId:req.userData.userId }).then((result) => {
    console.log(result)
    if(result.n > 0){
      res.status(200).json({
         message: "Deletion Successful!",
      });
    }else {
      res.status(401).json({
         message: "Not authorized To delete this product!",
      });
    }
  });
})

module.exports = router;
