const mongoose = require('mongoose');


const userSchema = mongoose.Schema ({
    fullname: String,
    email: String,
    age: Number,
    password: String,
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            default: ['67e6600c4fd16dd4873d449c']
        }
    ], 
    isadmin: Boolean,
    orders: {
        type: Array,
        default: []
    },
    contact: Number,
    picture: String
});

module.exports = mongoose.model('user' , userSchema);