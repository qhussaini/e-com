const express = require("express");

const Product = require('../models/product');
const Category = require('../models/category');
const Flavor = require('../models/flavor');
const Cart = require("../models/cart");
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/products");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/category");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", checkAuth, multer({storage: storage}).single("itemImage"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const product = new Product({
    itemName: req.body.itemName,
    itemCategory: req.body.itemCategory,
    itemMRP: req.body.itemMRP,
    itemFlavors: req.body.itemFlavors,
    itemImgUrl: url + "/images/products/" + req.file.filename,
    creator: req.userData.userId
  });
  product.save().then(createdProduct => {
    res.status(201).json({
      message: 'Product added successfully',
      product: {
        ...createdProduct,
        id: createdProduct._id
      }
    });
  });
});

router.post("/category", checkAuth, multer({storage: storageCategory}).single("categoryImage"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const category = new Category({
    category: req.body.newCategory,
    categoryImage: url + "/images/category/" + req.file.filename,
  });
  category.save().then(newcategory => {
    res.status(201).json({
      message: "category added successfully",
      category: newcategory
    })
  })
})
router.get("/flavors", (req, res, next) => {
  Flavor.find().then(document => {
    res.status(200).json({
      message: "flavor fetched succesfully!",
      flavor: document
    });
  });
})
router.post("/flavor", checkAuth, (req, res, next) => {
  // console.log("cat : "+ req.body.newCategory)
  const flavor = new Flavor({
    flavor: req.body.newFlavors
  });
  flavor.save().then(newFlavor => {
    res.status(201).json({
      message: "flavor added successfully",
      flavor: newFlavor
    })
  })
})
router.get("/categorys", (req, res, next) => {
  Category.find().then(document => {
    res.status(200).json({
      message: "Categorys fetched succesfully!",
      category: document
    });
  });
})

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProduct;
  if (pageSize && currentPage){
    productQuery
      .skip(pageSize * (currentPage -1))
      .limit(pageSize);
  }
  productQuery.then(document => {
    fetchedProduct = document;
    return Product.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Products fetched succesfully!",
      products: fetchedProduct,
      maxProducts: count
    });
  })
});

router.get("/:itemId", (req, res, next) => {
  Product.findById(req.params.itemId).then(product => {
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "product not found" })
    }
  });
});

router.put("/:itemId", checkAuth, multer({storage: storage}).single("itemImage"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.itemId,
    itemName: req.body.itemName,
    itemCategory: req.body.itemCategory,
    itemMRP: req.body.itemMRP,
    itemFlavors: req.body.itemFlavors,
    itemImgUrl: imagePath,
  });
  Product.updateOne({ _id: req.params.itemId, creator:req.userData.userId }, product).then(result => {
      if(result.nModified > 0){
        res.status(200).json({
           message: "Update Successful!",
        });
      }else {
        res.status(401).json({
           message: "Not authorized To update this product!",
        });
      }
  });
});

router.delete("/:itemId", checkAuth, (req, res, next) => {
  Product.deleteOne({ _id: req.params.itemId, creator:req.userData.userId }).then((result) => {
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
});

router.delete("/categorys/:categoryId", (req, res, next) => {
  Category.deleteOne({ _id: req.params.categoryId }).then((result) => {
    res.status(200).json({ message: "Category deleted!" });
  });
});
router.delete("/flavors/:flavorId", (req, res, next) => {
  Flavor.deleteOne({ _id: req.params.flavorId }).then((result) => {
    res.status(200).json({ message: "Flavor deleted!" });
  });
});




module.exports = router;
