const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    productname: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    description: String,
    tag: String,
    rating: String,
    discountedPrice: Number,
});


module.exports = mongoose.model("product", productSchema);
