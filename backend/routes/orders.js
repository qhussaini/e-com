const express = require("express");

const Oreder = require("../models/order");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  console.log(req.body.address);
  const order = new Oreder({
    product: req.body.productId,
    creatorId: req.userData.userId,
    creatorName: req.userData.userName,
    creatorShop: req.userData.shopName,
    orderStatus: req.body.orderStatus,
    orderDate: req.body.orderDate,
    address: req.body.address,
    payInfo: req.body.payInfo
  });
  order.save().then(order => {
    res.status(201).json({
      message: "order successfull",
      order:order
    })
  })
});

router.get("", checkAuth, (req, res, next) => {
  Oreder.find().then(document => {
    res.status(200).json({
      message: "Cart fetched succesfully!",
      cart: document
    });
  });
})
router.get("/client", checkAuth, (req, res, next) => {
  Oreder.find({creatorId: req.userData.userId}).then(document => {
    res.status(200).json({
      message: "Cart fetched succesfully!",
      cart: document
    });
  });
})

router.get("/myOrder/:orderId", checkAuth, (req, res, next) => {
  Oreder.findOne({creatorId: req.userData.userId, _id: req.params.orderId}).then(document => {
    console.log(document)
    res.status(200).json({
      message: "order fetched succesfully!",
      order: document
    });
  });
})

router.get("/orderAd/:orderId/:userId", checkAuth, (req, res, next) => {
  console.log(req.params.userId)
  Oreder.findOne({creatorId: req.params.userId, _id: req.params.orderId}).then(document => {
    console.log(document)
    res.status(200).json({
      message: "order fetched succesfully!",
      order: document
    });
  });
})

router.get("/order/:orderId", checkAuth, (req, res, next) => {
  Oreder.findOne({_id: req.params.orderId}).then(document => {
    console.log(document)
    res.status(200).json({
      message: "order fetched succesfully!",
      order: document
    });
  });
})

router.put("/update/:cartId", checkAuth, (req, res, next) => {
  Oreder.updateOne({creatorId: req.body.creatorId, _id: req.params.cartId}, {orderStatus:req.body.orderStatus} ).then(document => {
    if(document.n > 0){
      res.status(200).json({
         message: "Update Successful!",
         orderStatus: req.body.orderStatus,
      });
    }else {
      res.status(401).json({
         message: "Not authorized To update this Order!",
      });
    }
  });
})

module.exports = router;
