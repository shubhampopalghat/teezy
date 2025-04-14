const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get wishlist
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to wishlist
router.post('/add', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);
        
        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist.pull(req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear wishlist
router.delete('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = [];
        await user.save();
        res.json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 