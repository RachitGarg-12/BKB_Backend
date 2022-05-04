const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
// const User = require('../models/User');
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Get all order of logged user using: GET "/api/auth/getorders". login required
router.get('/getorders', fetchuser, async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2: Order an item using POST "api/auth/order". Login required
router.post('/order', fetchuser, async (req, res) => {
    try {
        const { itemCode, title, imgLink, owner,used, price, delivered } = req.body;
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newItem = new Order({
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