const express = require("express");
const router = express.Router();
const productModel = require('../models/product-model');
const upload = require('../config/multer-config');

router.get('/', (req, res) => {
    res.send("hey product");
});

router.post('/create', upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Image file is required!");
        }

        let { productname, price, discount, tag, rating, description } = req.body;

        let discountedPrice = Number(price) - (Number(discount) / 100 * Number(price));

        let product = await productModel.create({
            image: req.file.buffer,
            productname,
            price: Number(price),
            discount: Number(discount),
            tag,
            rating,
            discountedPrice,
            description
        });

        req.flash('success', 'Product created successfully');
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
