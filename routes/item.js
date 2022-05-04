const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 : Add item to BKB using POST : "/api/auth/getproducts". login required
router.post('/additem', fetchuser, async (req, res) => {
    try {
        const { itemCode, title, imgLink,category, owner, used, price, location, description } = req.body;
        // console.log(itemCode, title, imgLink, owner, used, price, location, description);
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newItem = new Item({
            user: req.user.id,
            itemCode,
            title,
            imgLink,
            category,
            owner,
            used,
            price,
            location,
            description
        })
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get items of some category: POST "/api/auth/getproducts". login required
router.post('/getproducts/:category', async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        const items = await Item.find({ category: req.params.category });
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Get any specific products : POST "/api/auth/getproducts". login required
router.get('/getitem/:itemcode', async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        const item = await Item.find({ itemCode: req.params.itemcode });
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router