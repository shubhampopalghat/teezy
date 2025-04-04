const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");



router.post('/create', async (req, res) => {
   
        let {fullname , email , password} = req.body;
        let owner = await ownerModel.find();
        if (owner.length > 0) {
            res
            .status(500)
            .send("Owner already exists");
        }
        else {
            let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res
        .status(200)
        .send("Owner created successfully");
        }
       
    });

router.get("/", (req, res) => {
    res.send("Hey owner");
});

 router.get('/admin', async (req, res) => {
    let success = req.flash('success');
    res.render('createproducts', { success });
 });


module.exports = router;