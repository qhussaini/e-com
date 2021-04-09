const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/products');



const app = express();

mongoose.connect("mongodb+srv://postuser:VuOA4COivk92uT9j@cluster0.b76v3.mongodb.net/azamscoops?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/user",userRoutes);
app.use("/api/admin/products",productsRoutes);

module.exports = app;
