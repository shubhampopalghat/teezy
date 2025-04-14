const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true
    },
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    }],
    colors: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    customizations: {
        type: Boolean,
        default: false
    },
    customizationOptions: {
        text: {
            type: Boolean,
            default: false
        },
        image: {
            type: Boolean,
            default: false
        },
        colors: [{
            type: String
        }]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 