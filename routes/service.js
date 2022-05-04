const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Service = require('../models/Service');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Get items which are at service centre details using: GET "/api/auth/getservicable". login required
router.get('/getservicable', fetchuser, async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        const orders = await Service.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get all items which are at service centre details using: GET "/api/auth/getallitems". (Only for admin)
router.get('/getallitems', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // console.log(user);
        let orders = [];
        if (user.email==="admin123@gmail.com"){
            orders = await Service.find();
        }
        let success = true;
        if (orders.length==0) {
            success = false;
        }
        res.json({orders,success});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Sent any item to service center POST "api/auth/service". Login required
router.post('/service', fetchuser, async (req, res) => {
    try {
        const { itemCode, title, imgLink, owner,used, price, delivered } = req.body;
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newItem = new Service({
            user: req.user.id,
            itemCode,
            title,
            imgLink,
            owner,
            used,
            price,
            delivered,
        })
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router