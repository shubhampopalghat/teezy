const express = require("express");
const router = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', async (req, res) => {
    let error = req.flash('error');
    let success = req.flash('success');
    let products = await productModel.find();
    res.render('index', { products, error, success, loggedin: false, isLoggedIn });
});

// router.get('/shop', isLoggedIn , (req,res) => {
//     res.render('shop', {user: req.user});
// });

router.get('/cart', isLoggedIn, async (req, res) => {
    let user = req.user;
    user.populate('cart');
    let bill = 500;
    res.render('cart', { user, bill, isLoggedIn });
});


router.get('/register', (req, res) => {
    let error = req.flash('error');
    let success = req.flash('success');
    res.render('register', { error, success, isLoggedIn });
});

router.get('/login', (req, res) => {
    let error = req.flash('error');
    let success = req.flash('success');
    res.render('login', { error, success, isLoggedIn });
});



router.get('/shop', isLoggedIn, async (req, res) => {
    let products = req.user.products;
    let success = req.flash('success');
    let error = req.flash('error');
    res.render('shop', { products, success, error, isLoggedIn });
});


router.get('/shop/:id', isLoggedIn, async (req, res) => {
    let products = await productModel.find({ _id: req.params.id });
    let success = req.flash('success');
    let error = req.flash('error');
    res.render('shop', { products, success, error, isLoggedIn });
});


router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    let success = req.flash('success', 'Item added to cart');
    res.redirect('/shop');
});

router.get('/wishlist', isLoggedIn, async (req, res) => {
    let products = await productModel.find({ _id: req.params.id });
    let success = req.flash('success');
    let error = req.flash('error');
    res.render('shop', { products, success, error, isLoggedIn });
});

router.get('/wishlist/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate('cart');
    user.wishlist.push(req.params.productid);
    await user.save();
    req.flash('success', 'Item added to cart');
    res.redirect('/wishlist');
});


router.get('/removefromcart/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.pop(req.params.productid);
    await user.save();
    let success = req.flash('success', 'item removed from cart');
    res.redirect('/shop');
});

router.get('/delete/:productid', isLoggedIn, async (req, res) => {
    let id = req.params.productid;
    await productModel.findByIdAndDelete(id);
    req.flash('success', 'item removed from cart');
    res.redirect('/');
});


module.exports = router;