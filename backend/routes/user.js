const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth")

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.passWord, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        userName: req.body.userName,
        shopName:req.body.shopName,
        shopNumber:req.body.shopNumber,
        password: hash,
        userType: req.body.userType,
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message:"User created!",
          });
        })
        .catch(err => {
          res.status(500).json({
            error:err
          });
        });
    });
});

router.get("", checkAuth, (req, res, next) => {
  User.findOne({ _id : req.userData.userId }).then(document => {
    res.status(200).json({
      userName: document.userName
    });
  })
});
router.get("/client/:id", checkAuth, (req, res, next) => {
  User.findOne({ _id : req.params.id }).then(document => {
    res.status(200).json({
      userName: document.userName
    });
  })
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if(!user){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.passWord, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: 'Unauthorised Check your email & password'
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id, userName: fetchedUser.userName, shopName: fetchedUser.shopName }, process.env.JWT_KEY, { expiresIn:"1h" });
    res.status(200).json({
      id: fetchedUser._id,
      email: fetchedUser.email,
      token: token,
      expiresIn: 3600,
      userType: fetchedUser.userType,
      userName: fetchedUser.userName,
      address: fetchedUser.address,
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Unauthorised Check your email & password'
    });
  });
})

router.post("/checkAuth", checkAuth, (req, res, next) => {
    User.findOne({ email: req.userData.email }).then(user => {
      if(!user){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      return bcrypt.compare(req.body.passWord, user.password);
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Unauthorised Check your password'
        });
      }
      res.status(200).json({
        message: 'auth Successful'
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Unauthorised Check your password'
      });
    });
})
router.post("/address", checkAuth, (req, res, next) => {
  addressData = {
    name: req.body.name,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    pincode: req.body.pincode,
  }
  User.updateOne({_id: req.userData.userId}, {address: addressData}).then(document => {
    console.log(addressData)
    res.status(200).json({
      message:"done"
    })
  });
})

module.exports = router;
