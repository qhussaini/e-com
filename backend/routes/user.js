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
        message: 'Auth failed'
      });
    }
    const token = jwt.sign({loginId: fetchedUser.loginId, userId: fetchedUser._id, userType: fetchedUser.userType}, "secret_encrypt_doc_appointment", { expiresIn:"1h" });
    res.status(200).json({
      token: token,
      expiresIn: 3600
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
})

module.exports = router;
