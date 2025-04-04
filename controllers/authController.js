const userModel = require("../models/user-model");
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser =  async (req, res) => {
    try {
        let { fullname, email, password,  age, cart, isAdmin, orders, contact, picture } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            req.flash('error', 'User already exists');
            res.redirect('/');
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return res.status(500).send(err.message);                    
                    let createdUser = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                        age,
                        cart,
                        isAdmin,
                        orders,
                        contact,
                        picture
                    });

                    let token = generateToken(createdUser);
                    res.cookie('token' , token);

                    req.flash('success', 'User created successfully');
                    res.redirect('/');
                });
            });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports.loginUser = async (req,res) => {
    let user = await userModel.findOne({ email: req.body.email});
    if (!user) {
        req.flash('error', 'You need to register first');
        res.redirect('/');
    } 
    else {
        bcrypt.compare(req.body.password , user.password , (err, result) => {
            if (result) {
                let token = generateToken(user);
                res.cookie('token' , token);
                res.redirect('/shop');
            }
            else {
                req.flash('error', 'login failed');
                res.redirect('/');
            }
        })
    }
};


module.exports.logoutUser = (req,res) => {
    res.clearCookie('token');
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
};