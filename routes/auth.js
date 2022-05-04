const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "yoge$hpr@sh@n1R@chi1";


// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    let success = false;
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        let phone = await User.findOne({ phone: req.body.phone });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" });
        }
        if (phone) {
            return res.status(400).json({ success, error: "Sorry a user with this number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create a new User
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            phone: req.body.phone
        })
        // console.log(user);

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.json(user);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }
});


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
// email and password is required for login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }
})


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try { 
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 4: Update User Details using : PUT "api/auth/updateid". Login required
router.put('/updateid', fetchuser, async (req, res) => {
    const { name, password } = req.body;
    let success = true;
    try {

        let user = await User.findById(req.user.id);

        // Create a newDetails object
        const newDetails = {};
        if (name) { newDetails.name = name }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            newDetails.password = secPass;
        }

        // Find the user to be updated and update its details
        if (!user) { return res.status(404).send("NOT FOUND") }

        user = await User.findByIdAndUpdate(req.user.id, { $set: newDetails }, { new: true });
        res.json({ user, success });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



// ROUTE 5 : Find products cotaining a specific value
router.get('/search/:itemcode', async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        let itemc = req.params.itemcode.toLowerCase();
        // console.log(itemc);
        const items = await Item.find({$or:[{"category":{$regex:itemc, $options : "i"}},{"title":{$regex:itemc, $options : "i"}}]}) 
        // console.log(items);
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router