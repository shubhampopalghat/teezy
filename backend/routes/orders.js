const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Create order (checkout)
router.post('/checkout', auth, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const user = await User.findById(req.user._id).populate('cart.product');

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount
        let totalAmount = 0;
        const items = user.cart.map(item => {
            const product = item.product;
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            return {
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                customization: item.customization
            };
        });

        // Create order
        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Update product stock
        for (const item of user.cart) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }

        // Save order and clear cart
        await order.save();
        user.orders.push(order._id);
        user.cart = [];
        await user.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        // Update order status
        order.status = 'cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            product.stock += item.quantity;
            await product.save();
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 