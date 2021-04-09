const express = require("express");

const Product = require('../models/product');
const Category = require('../models/category');
const Flavor = require('../models/flavor');
const multer = require('multer')

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
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("itemImage"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const product = new Product({
    itemName: req.body.itemName,
    itemCategory: req.body.itemCategory,
    itemMRP: req.body.itemMRP,
    itemFlavors: req.body.itemFlavors,
    itemImgUrl: url + "/images/" + req.file.filename
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

router.post("/category", (req, res, next) => {
  // console.log("cat : "+ req.body.newCategory)
  const category = new Category({
    category: req.body.newCategory
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
      message: "Posts fetched succesfully!",
      flavor: document
    });
  });
})
router.post("/flavor", (req, res, next) => {
  // console.log("cat : "+ req.body.newCategory)
  const category = new Flavor({
    flavor: req.body.newFlavors
  });
  category.save().then(newFlavor => {
    res.status(201).json({
      message: "flavor added successfully",
      flavor: newFlavor
    })
  })
})
router.get("/categorys", (req, res, next) => {
  Category.find().then(document => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
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

router.put("/:itemId", multer({storage: storage}).single("itemImage"), (req, res, next) => {
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
  Product.updateOne({ _id: req.params.itemId }, product).then(result => {
    console.log(result)
    res.status(200).json({
       message: "Update Successful!",
      //  itemImage: result.
      });
  });
});

router.delete("/:itemId", (req, res, next) => {
  Product.deleteOne({ _id: req.params.itemId }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "post deleted!" });
  });
});


module.exports = router;
