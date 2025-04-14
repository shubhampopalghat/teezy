const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get cart
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity, customization } = req.body;
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);
        
        // Check if product is already in cart
        const existingItem = user.cart.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: quantity || 1,
                customization
            });
        }

        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item
router.put('/:itemId', auth, async (req, res) => {
    try {
        const { quantity, customization } = req.body;
        const user = await User.findById(req.user._id);
        
        const cartItem = user.cart.id(req.params.itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (quantity) cartItem.quantity = quantity;
        if (customization) cartItem.customization = customization;

        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from cart
router.delete('/:itemId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart.pull(req.params.itemId);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 