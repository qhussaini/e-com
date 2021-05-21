const express = require("express");

const Address = require("../models/address");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/add", checkAuth, (req, res, next) => {
  console.log(req.body.name);
  const address = new Address({
    creatorId: req.userData.userId,
    name: req.body.name,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    pincode: req.body.pincode,
    phone: req.body.phone,
    country: req.body.country,
  });
  address.save().then(address => {
    res.status(201).json({
      message: "address add successfully",
      address: address
    })
  })
});

router.get("/get", checkAuth, (req, res, next) => {
  Address.find({creatorId: req.userData.userId}).then(addr => {
    res.status(200).json({
      message: "Address fetched succesfully!",
      address: addr
    });
  })
})
router.delete("/delete/:addressId", checkAuth, (req, res, next) => {
  Address.deleteOne({creatorId: req.userData.userId, _id: req.params.addressId }).then((result) => {
    res.status(200).json({ message: "Address deleted!" });
  });
})

module.exports = router;
